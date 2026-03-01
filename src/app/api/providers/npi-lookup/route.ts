import { NextRequest, NextResponse } from "next/server";
import { tryAuth } from "@/lib/auth";

// NPPES NPI Registry — free public API, no key required
const NPI_API = "https://npiregistry.cms.hhs.gov/api/";

export async function GET(req: NextRequest) {
  const authResult = await tryAuth();
  if (authResult instanceof NextResponse) return authResult;

  const firstName = req.nextUrl.searchParams.get("first_name")?.trim();
  const lastName  = req.nextUrl.searchParams.get("last_name")?.trim();
  const state     = req.nextUrl.searchParams.get("state")?.trim() || "NV";

  if (!lastName) {
    return NextResponse.json({ error: "last_name is required" }, { status: 400 });
  }

  const params = new URLSearchParams({
    version: "2.1",
    enumeration_type: "NPI-1", // individual providers
    taxonomy_description: "Dentist",
    last_name: lastName,
    ...(firstName ? { first_name: firstName } : {}),
    state,
    limit: "5",
  });

  const res = await fetch(`${NPI_API}?${params.toString()}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "NPI registry unavailable" }, { status: 502 });
  }

  const json = await res.json() as {
    result_count: number;
    results: Array<{
      number: string;
      basic: {
        first_name: string;
        last_name: string;
        name_prefix?: string;
        credential?: string;
        gender?: string;
        last_updated?: string;
        status?: string;
      };
      taxonomies?: Array<{
        code: string;
        desc: string;
        primary: boolean;
        state?: string;
        license?: string;
      }>;
      addresses?: Array<{
        address_1?: string;
        city?: string;
        state?: string;
        postal_code?: string;
        country_code?: string;
        address_purpose?: string;
      }>;
    }>;
  };

  if (!json.result_count || !json.results?.length) {
    return NextResponse.json({ results: [] });
  }

  const results = json.results.map((r) => {
    const primaryTaxonomy = r.taxonomies?.find((t) => t.primary) || r.taxonomies?.[0];
    const practiceAddr = r.addresses?.find((a) => a.address_purpose === "LOCATION") || r.addresses?.[0];

    return {
      npi: r.number,
      first_name: r.basic.first_name,
      last_name: r.basic.last_name,
      credential: r.basic.credential || null,
      status: r.basic.status || null,
      license_number: primaryTaxonomy?.license || null,
      license_state: primaryTaxonomy?.state || null,
      taxonomy: primaryTaxonomy?.desc || null,
      city: practiceAddr?.city || null,
      state: practiceAddr?.state || null,
    };
  });

  return NextResponse.json({ results });
}

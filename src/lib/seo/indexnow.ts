/**
 * IndexNow Integration (Engine Template)
 *
 * Config-driven IndexNow client that reads key and host from siteConfig.
 * Notifies search engines (Bing, Yandex, etc.) immediately when content changes.
 *
 * @see https://www.indexnow.org/
 */

import { siteConfig } from "@/lib/config";

function getHost(): string {
  try {
    return new URL(siteConfig.url).hostname;
  } catch {
    return "localhost";
  }
}

function getKey(): string {
  return siteConfig.seo.indexNowKey || "";
}

const INDEXNOW_ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
] as const;

interface IndexNowResponse {
  success: boolean;
  endpoint: string;
  status?: number;
  error?: string;
}

interface IndexNowResult {
  url: string;
  responses: IndexNowResponse[];
  allSuccessful: boolean;
}

/**
 * Submit a single URL to IndexNow
 */
export async function submitUrlToIndexNow(
  url: string
): Promise<IndexNowResult> {
  const key = getKey();
  const host = getHost();

  if (!key) {
    return {
      url,
      responses: [
        {
          success: false,
          endpoint: "none",
          error: "INDEXNOW_KEY not configured",
        },
      ],
      allSuccessful: false,
    };
  }

  const responses: IndexNowResponse[] = [];
  const endpoint = INDEXNOW_ENDPOINTS[0];
  const keyLocation = `https://${host}/${key}.txt`;

  try {
    const params = new URLSearchParams({
      url,
      key,
      keyLocation,
    });

    const response = await fetch(`${endpoint}?${params}`, {
      method: "GET",
    });

    responses.push({
      success: response.status === 200 || response.status === 202,
      endpoint,
      status: response.status,
    });
  } catch (error) {
    responses.push({
      success: false,
      endpoint,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }

  return {
    url,
    responses,
    allSuccessful: responses.every((r) => r.success),
  };
}

/**
 * Submit multiple URLs to IndexNow in a single batch request
 * Max 10,000 URLs per request
 */
export async function submitUrlsToIndexNow(urls: string[]): Promise<{
  submitted: number;
  successful: boolean;
  responses: IndexNowResponse[];
}> {
  const key = getKey();
  const host = getHost();

  if (!key) {
    return {
      submitted: 0,
      successful: false,
      responses: [
        {
          success: false,
          endpoint: "none",
          error: "INDEXNOW_KEY not configured",
        },
      ],
    };
  }

  if (urls.length === 0) {
    return { submitted: 0, successful: true, responses: [] };
  }

  const batchUrls = urls.slice(0, 10000);
  const responses: IndexNowResponse[] = [];
  const endpoint = INDEXNOW_ENDPOINTS[0];
  const keyLocation = `https://${host}/${key}.txt`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        host,
        key,
        keyLocation,
        urlList: batchUrls,
      }),
    });

    responses.push({
      success: response.status === 200 || response.status === 202,
      endpoint,
      status: response.status,
    });
  } catch (error) {
    responses.push({
      success: false,
      endpoint,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }

  return {
    submitted: batchUrls.length,
    successful: responses.every((r) => r.success),
    responses,
  };
}

/**
 * Get IndexNow configuration info
 */
export function getIndexNowConfig() {
  const key = getKey();
  const host = getHost();

  return {
    key: key ? `${key.substring(0, 8)}...` : "NOT SET",
    host,
    keyLocation: key ? `https://${host}/${key}.txt` : "NOT SET",
    configured: !!key,
  };
}

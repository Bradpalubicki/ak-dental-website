"use client";

export function FamilyPhoto() {
  return (
    <div className="relative w-full" style={{ aspectRatio: "4/3", minHeight: 240 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/dr-alex-family.jpg"
        alt="Dr. Alex Chireau DMD with his family — AK Ultimate Dental Las Vegas"
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
          const ph = e.currentTarget.nextElementSibling as HTMLElement | null;
          if (ph) ph.style.display = "flex";
        }}
      />
      <div
        className="absolute inset-0 items-center justify-center text-center p-8 bg-[#E8E3DA]"
        style={{ display: "none" }}
      >
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Family Photo Coming Soon
          </p>
          <p className="text-gray-400 text-sm">
            Drop <code className="bg-gray-200 px-1 rounded">dr-alex-family.jpg</code> into{" "}
            <code className="bg-gray-200 px-1 rounded">/public/</code> to display
          </p>
        </div>
      </div>
    </div>
  );
}

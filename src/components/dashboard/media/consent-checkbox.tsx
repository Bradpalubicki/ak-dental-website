"use client";

import { Shield } from "lucide-react";

interface ConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ConsentCheckbox({ checked, onChange }: ConsentCheckboxProps) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
        <div className="flex-1">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => onChange(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-amber-400 text-amber-600 focus:ring-amber-500"
            />
            <span className="font-semibold text-amber-900">
              I confirm I have written consent from this patient on file to use this photo on our website.
            </span>
          </label>
          <p className="mt-2 text-xs text-amber-700 leading-relaxed">
            HIPAA requires written patient authorization before publishing clinical photos.
            This checkbox is your legal attestation. {" "}
            <strong>AK Ultimate Dental is responsible for maintaining the signed consent form on file.</strong>
            {" "}NuStack does not store physical consent forms.
          </p>
        </div>
      </div>
    </div>
  );
}

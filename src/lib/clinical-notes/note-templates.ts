import { getVerticalConfig } from "@/config";
import type { NoteTemplate, NoteType } from "@/config/vertical";

export function getTemplatesForType(noteType?: NoteType): NoteTemplate[] {
  const vertical = getVerticalConfig();
  if (!noteType) return vertical.noteTemplates;
  return vertical.noteTemplates.filter((t) => t.type === noteType);
}

export function getDefaultTemplate(serviceCode?: string): NoteTemplate | undefined {
  const vertical = getVerticalConfig();
  if (serviceCode) {
    const match = vertical.noteTemplates.find(
      (t) => t.defaultForServiceCodes?.includes(serviceCode)
    );
    if (match) return match;
  }
  // Default to first template (usually SOAP)
  return vertical.noteTemplates[0];
}

export function getAllNoteTypes(): { type: NoteType; label: string }[] {
  const vertical = getVerticalConfig();
  return vertical.noteTemplates.map((t) => ({ type: t.type, label: t.label }));
}

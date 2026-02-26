// Vertical Config Loader
// Returns the correct vertical configuration based on engine type

import type { VerticalConfig, VerticalType } from '../vertical';
import { dentalVertical } from './dental';

const verticals: Record<string, VerticalConfig> = {
  dental: dentalVertical,
};

export function getVerticalConfig(type?: VerticalType): VerticalConfig {
  const key = type ?? (process.env.NEXT_PUBLIC_ENGINE_TYPE as VerticalType) ?? 'dental';
  const config = verticals[key];
  if (!config) {
    // Default to dental for this practice
    return dentalVertical;
  }
  return config;
}

export { dentalVertical } from './dental';

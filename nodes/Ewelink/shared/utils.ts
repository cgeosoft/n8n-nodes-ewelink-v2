/**
 * Parse device params from additional fields input
 */
export function parseDeviceParams(paramsInput: string | object): Record<string, unknown> {
  if (typeof paramsInput === 'string') {
    try {
      return JSON.parse(paramsInput);
    } catch {
      return {};
    }
  }
  return paramsInput as Record<string, unknown>;
}

/**
 * Format device switch params for single or multi-channel devices
 */
export function formatSwitchParams(state: 'on' | 'off', outlet?: number): Record<string, unknown> {
  // For multi-channel devices (outlet specified, including 0)
  if (outlet !== undefined && outlet >= 0) {
    return {
      switches: [{ switch: state, outlet }],
    };
  }

  // For single-channel devices (no outlet specified)
  return { switch: state };
}

/**
 * Extract thing list from getAllThings response
 * Item types: 1 = own device, 2 = shared device, 3 = group
 */
export interface ThingItem {
  itemType: number;
  itemData: Record<string, unknown>;
}

export function extractDevices(thingList: ThingItem[]): Record<string, unknown>[] {
  return thingList
    .filter((item) => item.itemType === 1 || item.itemType === 2)
    .map((item) => ({
      ...item.itemData,
      isShared: item.itemType === 2,
    }));
}

export function extractGroups(thingList: ThingItem[]): Record<string, unknown>[] {
  return thingList.filter((item) => item.itemType === 3).map((item) => item.itemData);
}

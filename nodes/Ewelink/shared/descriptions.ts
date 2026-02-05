import type { INodeProperties } from 'n8n-workflow';

export const deviceIdField: INodeProperties = {
  displayName: 'Device ID',
  name: 'deviceId',
  type: 'string',
  default: '',
  required: true,
  description: 'The ID of the device (e.g., "1000ba370c")',
};

export const familyIdField: INodeProperties = {
  displayName: 'Family ID',
  name: 'familyId',
  type: 'string',
  default: '',
  description: 'The family ID. Leave empty to use the default family.',
};

export const roomIdField: INodeProperties = {
  displayName: 'Room ID',
  name: 'roomId',
  type: 'string',
  default: '',
  description: 'The room ID to assign the device to',
};

export const groupIdField: INodeProperties = {
  displayName: 'Group ID',
  name: 'groupId',
  type: 'string',
  default: '',
  required: true,
  description: 'The ID of the device group',
};

export const languageField: INodeProperties = {
  displayName: 'Language',
  name: 'lang',
  type: 'options',
  options: [
    { name: 'Chinese', value: 'cn' },
    { name: 'English', value: 'en' },
  ],
  default: 'en',
  description: 'Language for returned data',
};

export const thingTypeField: INodeProperties = {
  displayName: 'Thing Type',
  name: 'type',
  type: 'options',
  options: [
    { name: 'Device', value: 'device' },
    { name: 'Group', value: 'group' },
  ],
  default: 'device',
  description: 'Whether to control a device or a group',
};

export const switchStateField: INodeProperties = {
  displayName: 'State',
  name: 'switchState',
  type: 'options',
  options: [
    { name: 'On', value: 'on' },
    { name: 'Off', value: 'off' },
  ],
  default: 'on',
  description: 'The state to set the device to',
};

export const channelField: INodeProperties = {
  displayName: 'Channel',
  name: 'outlet',
  type: 'number',
  default: 0,
  description: 'Channel number for multi-channel devices (0 for single channel or all channels)',
};

export const paginationFields: INodeProperties[] = [
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: true,
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 50,
    description: 'Max number of results to return',
    typeOptions: {
      minValue: 1,
      maxValue: 100,
    },
    displayOptions: {
      show: {
        returnAll: [false],
      },
    },
  },
];

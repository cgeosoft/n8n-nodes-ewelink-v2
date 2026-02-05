import type { INodeProperties } from 'n8n-workflow';
import {
  channelField,
  deviceIdField,
  familyIdField,
  languageField,
  paginationFields,
  switchStateField,
} from '../../shared/descriptions';

export const deviceOperations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['device'],
    },
  },
  options: [
    {
      name: 'Delete',
      value: 'delete',
      description: 'Delete a device',
      action: 'Delete a device',
    },
    {
      name: 'Get',
      value: 'get',
      description: 'Get a device by ID',
      action: 'Get a device',
    },
    {
      name: 'Get History',
      value: 'getHistory',
      description: 'Get device operation history',
      action: 'Get device history',
    },
    {
      name: 'Get Many',
      value: 'getAll',
      description: 'Get many devices',
      action: 'Get many devices',
    },
    {
      name: 'Get Status',
      value: 'getStatus',
      description: 'Get current device status',
      action: 'Get device status',
    },
    {
      name: 'Set Status',
      value: 'setStatus',
      description: 'Control a device (turn on/off, etc.)',
      action: 'Set device status',
    },
    {
      name: 'Share',
      value: 'share',
      description: 'Share device with another user',
      action: 'Share a device',
    },
    {
      name: 'Update',
      value: 'update',
      description: 'Update device information',
      action: 'Update a device',
    },
  ],
  default: 'getAll',
};

const getAllFields: INodeProperties[] = [
  {
    ...familyIdField,
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['getAll'],
      },
    },
  },
  {
    ...languageField,
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['getAll'],
      },
    },
  },
  {
    ...paginationFields[0],
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['getAll'],
      },
    },
  },
  {
    ...paginationFields[1],
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
  },
];

const getFields: INodeProperties[] = [
  {
    ...deviceIdField,
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['get'],
      },
    },
  },
];

const getStatusFields: INodeProperties[] = [
  {
    ...deviceIdField,
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['getStatus'],
      },
    },
  },
  {
    displayName: 'Parameters',
    name: 'params',
    type: 'string',
    default: '',
    description:
      'Specific parameters to get (comma-separated, e.g., "switch,brightness"). Leave empty for all.',
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['getStatus'],
      },
    },
  },
];

const setStatusFields: INodeProperties[] = [
  {
    ...deviceIdField,
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['setStatus'],
      },
    },
  },
  {
    ...switchStateField,
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['setStatus'],
      },
    },
  },
  {
    ...channelField,
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['setStatus'],
      },
    },
    description:
      'Channel number for multi-channel devices (0 = all channels or single-channel device, 1+ for specific channel)',
  },
  {
    displayName: 'Additional Parameters',
    name: 'additionalParams',
    type: 'json',
    default: '{}',
    description: 'Additional parameters as JSON (e.g., {"brightness": 50, "colorTemp": 100})',
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['setStatus'],
      },
    },
  },
];

const getHistoryFields: INodeProperties[] = [
  {
    ...deviceIdField,
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['getHistory'],
      },
    },
  },
  {
    displayName: 'Limit',
    name: 'num',
    type: 'number',
    default: 30,
    description: 'Max number of history records to return (max 30)',
    typeOptions: {
      minValue: 1,
      maxValue: 30,
    },
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['getHistory'],
      },
    },
  },
];

const deleteFields: INodeProperties[] = [
  {
    ...deviceIdField,
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['delete'],
      },
    },
  },
];

const updateFields: INodeProperties[] = [
  {
    ...deviceIdField,
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'New Name',
    name: 'newName',
    type: 'string',
    default: '',
    description: 'New name for the device',
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'New Room ID',
    name: 'newRoomId',
    type: 'string',
    default: '',
    description: 'Move device to a different room',
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['update'],
      },
    },
  },
];

const shareFields: INodeProperties[] = [
  {
    ...deviceIdField,
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['share'],
      },
    },
  },
  {
    displayName: 'Share Method',
    name: 'shareMethod',
    type: 'options',
    options: [
      { name: 'Email', value: 'email' },
      { name: 'Phone', value: 'phone' },
    ],
    default: 'email',
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['share'],
      },
    },
  },
  {
    displayName: 'Country Code',
    name: 'countryCode',
    type: 'string',
    default: '+1',
    description: 'Country code (e.g., +1 for US, +30 for Greece)',
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['share'],
      },
    },
  },
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    default: '',
    placeholder: 'user@example.com',
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['share'],
        shareMethod: ['email'],
      },
    },
  },
  {
    displayName: 'Phone Number',
    name: 'phoneNumber',
    type: 'string',
    default: '',
    placeholder: '1234567890',
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['share'],
        shareMethod: ['phone'],
      },
    },
  },
  {
    displayName: 'Permissions',
    name: 'permit',
    type: 'number',
    default: 1,
    description: 'Permission level: 1 = update, 2 = read-only, 4 = timer',
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['share'],
      },
    },
  },
];

export const deviceFields: INodeProperties[] = [
  ...getAllFields,
  ...getFields,
  ...getStatusFields,
  ...setStatusFields,
  ...getHistoryFields,
  ...deleteFields,
  ...updateFields,
  ...shareFields,
];

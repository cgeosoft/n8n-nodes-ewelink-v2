import type { INodeProperties } from 'n8n-workflow';
import {
  familyIdField,
  groupIdField,
  languageField,
  switchStateField,
} from '../../shared/descriptions';

export const groupOperations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['group'],
    },
  },
  options: [
    {
      name: 'Create',
      value: 'create',
      description: 'Create a device group',
      action: 'Create a group',
    },
    {
      name: 'Delete',
      value: 'delete',
      description: 'Delete a group',
      action: 'Delete a group',
    },
    {
      name: 'Get Many',
      value: 'getAll',
      description: 'Get many groups',
      action: 'Get many groups',
    },
    {
      name: 'Set Status',
      value: 'setStatus',
      description: 'Control all devices in a group',
      action: 'Set group status',
    },
    {
      name: 'Update',
      value: 'update',
      description: 'Update group name',
      action: 'Update a group',
    },
  ],
  default: 'getAll',
};

const getAllFields: INodeProperties[] = [
  {
    ...languageField,
    displayOptions: {
      show: {
        resource: ['group'],
        operation: ['getAll'],
      },
    },
  },
];

const createFields: INodeProperties[] = [
  {
    displayName: 'Group Name',
    name: 'name',
    type: 'string',
    default: '',
    required: true,
    description: 'Name for the new group',
    displayOptions: {
      show: {
        resource: ['group'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Main Device ID',
    name: 'mainDeviceId',
    type: 'string',
    default: '',
    required: true,
    description: 'ID of the main device in the group',
    displayOptions: {
      show: {
        resource: ['group'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Device IDs',
    name: 'deviceidList',
    type: 'string',
    default: '',
    required: true,
    description: 'Comma-separated list of device IDs to include in the group',
    displayOptions: {
      show: {
        resource: ['group'],
        operation: ['create'],
      },
    },
  },
  {
    ...familyIdField,
    displayOptions: {
      show: {
        resource: ['group'],
        operation: ['create'],
      },
    },
  },
];

const deleteFields: INodeProperties[] = [
  {
    ...groupIdField,
    displayOptions: {
      show: {
        resource: ['group'],
        operation: ['delete'],
      },
    },
  },
];

const setStatusFields: INodeProperties[] = [
  {
    ...groupIdField,
    displayOptions: {
      show: {
        resource: ['group'],
        operation: ['setStatus'],
      },
    },
  },
  {
    ...switchStateField,
    displayOptions: {
      show: {
        resource: ['group'],
        operation: ['setStatus'],
      },
    },
  },
];

const updateFields: INodeProperties[] = [
  {
    ...groupIdField,
    displayOptions: {
      show: {
        resource: ['group'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'New Name',
    name: 'newName',
    type: 'string',
    default: '',
    required: true,
    description: 'New name for the group',
    displayOptions: {
      show: {
        resource: ['group'],
        operation: ['update'],
      },
    },
  },
];

export const groupFields: INodeProperties[] = [
  ...getAllFields,
  ...createFields,
  ...deleteFields,
  ...setStatusFields,
  ...updateFields,
];

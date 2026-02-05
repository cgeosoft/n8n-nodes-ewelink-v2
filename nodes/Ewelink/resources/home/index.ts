import type { INodeProperties } from 'n8n-workflow';
import { familyIdField, languageField, roomIdField } from '../../shared/descriptions';

export const homeOperations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['home'],
    },
  },
  options: [
    {
      name: 'Add Room',
      value: 'addRoom',
      description: 'Add a room to a family',
      action: 'Add a room',
    },
    {
      name: 'Create Family',
      value: 'create',
      description: 'Create a new family',
      action: 'Create a family',
    },
    {
      name: 'Delete Family',
      value: 'delete',
      description: 'Delete a family',
      action: 'Delete a family',
    },
    {
      name: 'Delete Room',
      value: 'deleteRoom',
      description: 'Delete a room from a family',
      action: 'Delete a room',
    },
    {
      name: 'Get Home Page',
      value: 'homePage',
      description: 'Get combined home data (families, devices, scenes)',
      action: 'Get home page data',
    },
    {
      name: 'Get Many',
      value: 'getAll',
      description: 'Get many families',
      action: 'Get many families',
    },
    {
      name: 'Update Family',
      value: 'update',
      description: 'Update family name',
      action: 'Update a family',
    },
  ],
  default: 'getAll',
};

const getAllFields: INodeProperties[] = [
  {
    ...languageField,
    displayOptions: {
      show: {
        resource: ['home'],
        operation: ['getAll'],
      },
    },
  },
];

const createFields: INodeProperties[] = [
  {
    displayName: 'Family Name',
    name: 'name',
    type: 'string',
    default: '',
    required: true,
    description: 'Name for the new family',
    displayOptions: {
      show: {
        resource: ['home'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Sort Order',
    name: 'sort',
    type: 'options',
    options: [
      { name: 'Positive', value: 1 },
      { name: 'Negative', value: 2 },
    ],
    default: 1,
    description: 'Sort order for the family',
    displayOptions: {
      show: {
        resource: ['home'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Room Names',
    name: 'roomNameList',
    type: 'string',
    default: '',
    description: 'Comma-separated list of room names to create with the family',
    displayOptions: {
      show: {
        resource: ['home'],
        operation: ['create'],
      },
    },
  },
];

const deleteFields: INodeProperties[] = [
  {
    ...familyIdField,
    required: true,
    displayOptions: {
      show: {
        resource: ['home'],
        operation: ['delete'],
      },
    },
  },
  {
    displayName: 'Switch Current Family',
    name: 'switchFamily',
    type: 'boolean',
    default: true,
    description: 'Whether to switch to another family after deletion',
    displayOptions: {
      show: {
        resource: ['home'],
        operation: ['delete'],
      },
    },
  },
];

const updateFields: INodeProperties[] = [
  {
    ...familyIdField,
    required: true,
    displayOptions: {
      show: {
        resource: ['home'],
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
    description: 'New name for the family',
    displayOptions: {
      show: {
        resource: ['home'],
        operation: ['update'],
      },
    },
  },
];

const addRoomFields: INodeProperties[] = [
  {
    ...familyIdField,
    required: true,
    displayOptions: {
      show: {
        resource: ['home'],
        operation: ['addRoom'],
      },
    },
  },
  {
    displayName: 'Room Name',
    name: 'name',
    type: 'string',
    default: '',
    required: true,
    description: 'Name for the new room',
    displayOptions: {
      show: {
        resource: ['home'],
        operation: ['addRoom'],
      },
    },
  },
  {
    displayName: 'Sort Order',
    name: 'sort',
    type: 'options',
    options: [
      { name: 'Positive', value: 1 },
      { name: 'Negative', value: 2 },
    ],
    default: 1,
    description: 'Sort order for the room',
    displayOptions: {
      show: {
        resource: ['home'],
        operation: ['addRoom'],
      },
    },
  },
];

const deleteRoomFields: INodeProperties[] = [
  {
    ...familyIdField,
    required: true,
    displayOptions: {
      show: {
        resource: ['home'],
        operation: ['deleteRoom'],
      },
    },
  },
  {
    ...roomIdField,
    required: true,
    displayOptions: {
      show: {
        resource: ['home'],
        operation: ['deleteRoom'],
      },
    },
  },
];

const homePageFields: INodeProperties[] = [
  {
    displayName: 'Include User',
    name: 'getUser',
    type: 'boolean',
    default: true,
    description: 'Whether to include user information',
    displayOptions: {
      show: {
        resource: ['home'],
        operation: ['homePage'],
      },
    },
  },
  {
    displayName: 'Include Families',
    name: 'getFamily',
    type: 'boolean',
    default: true,
    description: 'Whether to include family information',
    displayOptions: {
      show: {
        resource: ['home'],
        operation: ['homePage'],
      },
    },
  },
  {
    displayName: 'Include Things',
    name: 'getThing',
    type: 'boolean',
    default: true,
    description: 'Whether to include devices and groups',
    displayOptions: {
      show: {
        resource: ['home'],
        operation: ['homePage'],
      },
    },
  },
  {
    displayName: 'Include Scenes',
    name: 'getScene',
    type: 'boolean',
    default: false,
    description: 'Whether to include scene information',
    displayOptions: {
      show: {
        resource: ['home'],
        operation: ['homePage'],
      },
    },
  },
  {
    displayName: 'Include Messages',
    name: 'getMessage',
    type: 'boolean',
    default: false,
    description: 'Whether to include messages/notifications',
    displayOptions: {
      show: {
        resource: ['home'],
        operation: ['homePage'],
      },
    },
  },
];

export const homeFields: INodeProperties[] = [
  ...getAllFields,
  ...createFields,
  ...deleteFields,
  ...updateFields,
  ...addRoomFields,
  ...deleteRoomFields,
  ...homePageFields,
];

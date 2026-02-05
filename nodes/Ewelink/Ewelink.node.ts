import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { executeDeviceOperation } from './resources/device/execute';
import { deviceFields, deviceOperations } from './resources/device/index';
import { executeGroupOperation } from './resources/group/execute';
import { groupFields, groupOperations } from './resources/group/index';
import { executeHomeOperation } from './resources/home/execute';
import { homeFields, homeOperations } from './resources/home/index';

export class Ewelink implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'eWeLink',
    name: 'ewelink',
    icon: 'file:../../icons/ewelink.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Control eWeLink smart home devices',
    defaults: {
      name: 'eWeLink',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'ewelinkApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Device',
            value: 'device',
            description: 'Manage and control devices',
          },
          {
            name: 'Group',
            value: 'group',
            description: 'Manage device groups',
          },
          {
            name: 'Home',
            value: 'home',
            description: 'Manage families and rooms',
          },
        ],
        default: 'device',
      },
      // Device
      deviceOperations,
      ...deviceFields,
      // Group
      groupOperations,
      ...groupFields,
      // Home
      homeOperations,
      ...homeFields,
    ],
    usableAsTool: true,
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    let returnData: INodeExecutionData[] = [];

    switch (resource) {
      case 'device':
        returnData = await executeDeviceOperation(this, operation, items);
        break;
      case 'group':
        returnData = await executeGroupOperation(this, operation, items);
        break;
      case 'home':
        returnData = await executeHomeOperation(this, operation, items);
        break;
      default:
        throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
    }

    return [returnData];
  }
}

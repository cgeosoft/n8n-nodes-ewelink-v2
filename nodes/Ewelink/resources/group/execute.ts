import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { type EwelinkClient, extractGroups, getEwelinkClient } from '../../shared';

function safeResponse(
  response: unknown,
  operation: string,
  extra?: Record<string, unknown>,
): IDataObject {
  const raw = response as Record<string, unknown>;
  return {
    _debug: {
      operation,
      error: raw?.error,
      msg: raw?.msg,
      status: raw?.status,
      ...extra,
    },
    _rawResponse: raw,
    ...(raw?.error === 0 ? (raw?.data as IDataObject) || {} : {}),
  };
}

export async function executeGroupOperation(
  context: IExecuteFunctions,
  operation: string,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];

  let client: EwelinkClient['client'];
  try {
    const result = await getEwelinkClient(context);
    client = result.client;
  } catch (error) {
    returnData.push({
      json: {
        _debug: { operation, error: 'client_init_failed' },
        error: (error as Error).message,
        stack: (error as Error).stack,
      },
      pairedItem: { item: 0 },
    });
    return returnData;
  }

  for (let i = 0; i < items.length; i++) {
    try {
      let responseData: IDataObject | IDataObject[];

      switch (operation) {
        case 'getAll': {
          const lang = context.getNodeParameter('lang', i, 'en') as 'en' | 'cn';

          const response = await client.device.getAllThingsAllPages({ lang });
          const raw = response as Record<string, unknown>;
          if (raw.error === 0) {
            const data = raw.data as {
              thingList?: Array<{ itemType: number; itemData: IDataObject }>;
            };
            const groups = extractGroups(data.thingList || []) as IDataObject[];
            responseData =
              groups.length > 0
                ? groups
                : [{ _debug: { operation, info: 'No groups found' }, _rawResponse: raw }];
          } else {
            responseData = safeResponse(response, operation, { lang });
          }
          break;
        }

        case 'create': {
          const name = context.getNodeParameter('name', i) as string;
          const mainDeviceId = context.getNodeParameter('mainDeviceId', i) as string;
          const deviceidListStr = context.getNodeParameter('deviceidList', i) as string;
          const familyId = context.getNodeParameter('familyId', i, '') as string;

          const deviceidList = deviceidListStr.split(',').map((id) => id.trim());

          const response = await client.device.addGroup({
            name,
            mainDeviceId,
            deviceidList,
            familyId: familyId || undefined,
          });
          responseData = safeResponse(response, operation, { name, mainDeviceId, deviceidList });
          break;
        }

        case 'delete': {
          const groupId = context.getNodeParameter('groupId', i) as string;

          const response = await client.device.delGroup({ id: groupId });
          responseData = safeResponse(response, operation, { groupId });
          break;
        }

        case 'setStatus': {
          const groupId = context.getNodeParameter('groupId', i) as string;
          const switchState = context.getNodeParameter('switchState', i) as 'on' | 'off';

          const response = await client.device.setThingStatus({
            type: 2,
            id: groupId,
            params: { switch: switchState },
          });
          responseData = safeResponse(response, operation, { groupId, switchState });
          break;
        }

        case 'update': {
          const groupId = context.getNodeParameter('groupId', i) as string;
          const newName = context.getNodeParameter('newName', i) as string;

          const response = await client.device.setGroup({ id: groupId, newName });
          responseData = safeResponse(response, operation, { groupId, newName });
          break;
        }

        default:
          throw new Error(`Unknown operation: ${operation}`);
      }

      const executionData = context.helpers.constructExecutionMetaData(
        context.helpers.returnJsonArray(responseData),
        { itemData: { item: i } },
      );
      returnData.push(...executionData);
    } catch (error) {
      if (context.continueOnFail()) {
        returnData.push({
          json: { error: (error as Error).message },
          pairedItem: { item: i },
        });
        continue;
      }
      throw error;
    }
  }

  return returnData;
}

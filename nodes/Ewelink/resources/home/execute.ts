import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { type EwelinkClient, getEwelinkClient } from '../../shared';

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

export async function executeHomeOperation(
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
          const response = await client.home.getFamily({ lang });
          responseData = safeResponse(response, operation, { lang });
          break;
        }

        case 'create': {
          const name = context.getNodeParameter('name', i) as string;
          const sort = context.getNodeParameter('sort', i, 1) as 1 | 2;
          const roomNameListStr = context.getNodeParameter('roomNameList', i, '') as string;

          const roomNameList = roomNameListStr
            ? roomNameListStr.split(',').map((r) => r.trim())
            : undefined;

          const response = await client.home.addFamily({ name, sort, roomNameList });
          responseData = safeResponse(response, operation, { name, sort });
          break;
        }

        case 'delete': {
          const familyId = context.getNodeParameter('familyId', i) as string;
          const deviceFamily = context.getNodeParameter('deviceFamily', i, '') as string;
          const switchFamily = context.getNodeParameter('switchFamily', i, '') as string;

          const response = await client.home.delFamily({
            id: familyId,
            deviceFamily: deviceFamily || familyId,
            switchFamily: switchFamily || familyId,
          });
          responseData = safeResponse(response, operation, { familyId });
          break;
        }

        case 'update': {
          const familyId = context.getNodeParameter('familyId', i) as string;
          const newName = context.getNodeParameter('newName', i) as string;

          const response = await client.home.setFamily({ id: familyId, newName });
          responseData = safeResponse(response, operation, { familyId, newName });
          break;
        }

        case 'addRoom': {
          const familyId = context.getNodeParameter('familyId', i) as string;
          const name = context.getNodeParameter('name', i) as string;
          const sort = context.getNodeParameter('sort', i, 1) as 1 | 2;

          const response = await client.home.addRoom({ familyId, name, sort });
          responseData = safeResponse(response, operation, { familyId, name });
          break;
        }

        case 'deleteRoom': {
          const roomId = context.getNodeParameter('roomId', i) as string;

          const response = await client.home.delRoom({ id: roomId });
          responseData = safeResponse(response, operation, { roomId });
          break;
        }

        case 'homePage': {
          const getUser = context.getNodeParameter('getUser', i, true) as boolean;
          const getFamily = context.getNodeParameter('getFamily', i, true) as boolean;
          const getThing = context.getNodeParameter('getThing', i, true) as boolean;
          const getScene = context.getNodeParameter('getScene', i, false) as boolean;
          const getMessage = context.getNodeParameter('getMessage', i, false) as boolean;

          const response = await client.home.homePage({
            getUser: getUser ? {} : undefined,
            getFamily: getFamily ? {} : undefined,
            getThing: getThing ? { num: 30 } : undefined,
            getScene: getScene ? {} : undefined,
            getMessage: getMessage ? { num: 30 } : undefined,
          });
          responseData = safeResponse(response, operation, {
            getUser,
            getFamily,
            getThing,
            getScene,
            getMessage,
          });
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

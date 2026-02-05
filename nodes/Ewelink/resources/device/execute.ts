import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import {
  type EwelinkClient,
  extractDevices,
  formatSwitchParams,
  getEwelinkClient,
  parseDeviceParams,
} from '../../shared';

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

export async function executeDeviceOperation(
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
          const familyId = context.getNodeParameter('familyId', i, '') as string;
          const lang = context.getNodeParameter('lang', i, 'en') as 'en' | 'cn';
          const returnAll = context.getNodeParameter('returnAll', i, true) as boolean;

          let response: unknown;
          if (returnAll) {
            response = await client.device.getAllThingsAllPages({
              familyId: familyId || undefined,
              lang,
            });
          } else {
            const limit = context.getNodeParameter('limit', i, 30) as number;
            response = await client.device.getAllThings({
              familyId: familyId || undefined,
              lang,
              num: limit,
            });
          }

          const rawResponse = response as Record<string, unknown>;
          if (rawResponse.error === 0) {
            const data = rawResponse.data as {
              thingList?: Array<{ itemType: number; itemData: IDataObject }>;
              total?: number;
            };
            const thingList = data?.thingList || [];
            const devices = extractDevices(thingList) as IDataObject[];
            responseData =
              devices.length > 0
                ? devices
                : [
                    {
                      _debug: {
                        operation,
                        info: 'No devices found',
                        total: data?.total || 0,
                        thingListLength: thingList.length,
                      },
                      _rawResponse: rawResponse,
                    },
                  ];
          } else {
            responseData = safeResponse(response, operation, { familyId, lang, returnAll });
          }
          break;
        }

        case 'get': {
          const deviceId = context.getNodeParameter('deviceId', i) as string;
          const response = await client.device.getThings({
            thingList: [{ itemType: 1 as const, id: deviceId }],
          } as never);
          const raw = response as Record<string, unknown>;
          if (raw.error === 0) {
            const data = raw.data as { thingList?: Array<{ itemData: IDataObject }> };
            responseData = { _debug: { operation }, ...(data.thingList?.[0]?.itemData || {}) };
          } else {
            responseData = safeResponse(response, operation, { deviceId });
          }
          break;
        }

        case 'getStatus': {
          const deviceId = context.getNodeParameter('deviceId', i) as string;
          const params = context.getNodeParameter('params', i, '') as string;

          const response = await client.device.getThingStatus({
            type: 1,
            id: deviceId,
            params: params || undefined,
          });
          responseData = safeResponse(response, operation, { deviceId, params });
          break;
        }

        case 'setStatus': {
          const deviceId = context.getNodeParameter('deviceId', i) as string;
          const switchState = context.getNodeParameter('switchState', i) as 'on' | 'off';
          const outlet = context.getNodeParameter('outlet', i, 0) as number;
          const additionalParams = context.getNodeParameter('additionalParams', i, '{}') as string;

          const baseParams = formatSwitchParams(switchState, outlet);
          const extraParams = parseDeviceParams(additionalParams);
          const finalParams = { ...baseParams, ...extraParams };

          const response = await client.device.setThingStatus({
            type: 1,
            id: deviceId,
            params: finalParams,
          });
          responseData = safeResponse(response, operation, {
            deviceId,
            switchState,
            outlet,
            sentParams: finalParams,
          });
          break;
        }

        case 'getHistory': {
          const deviceId = context.getNodeParameter('deviceId', i) as string;
          const num = context.getNodeParameter('num', i, 30) as number;

          const response = await client.device.getOperationHistory({
            deviceId,
            num,
          });
          responseData = safeResponse(response, operation, { deviceId, num });
          break;
        }

        case 'delete': {
          const deviceId = context.getNodeParameter('deviceId', i) as string;

          const response = await client.device.delDevice({
            id: deviceId,
          });
          responseData = safeResponse(response, operation, { deviceId });
          break;
        }

        case 'update': {
          const deviceId = context.getNodeParameter('deviceId', i) as string;
          const newName = context.getNodeParameter('newName', i, '') as string;
          const newRoomId = context.getNodeParameter('newRoomId', i, '') as string;

          const response = await client.device.setDeviceInfo({
            deviceId,
            newName: newName || undefined,
            newRoomId: newRoomId || undefined,
          });
          responseData = safeResponse(response, operation, { deviceId, newName, newRoomId });
          break;
        }

        case 'share': {
          const deviceId = context.getNodeParameter('deviceId', i) as string;
          const shareMethod = context.getNodeParameter('shareMethod', i) as string;
          const countryCode = context.getNodeParameter('countryCode', i) as string;
          const permit = context.getNodeParameter('permit', i, 1) as number;

          const user: { countryCode: string; email?: string; phoneNumber?: string } = {
            countryCode,
          };

          if (shareMethod === 'email') {
            user.email = context.getNodeParameter('email', i) as string;
          } else {
            user.phoneNumber = context.getNodeParameter('phoneNumber', i) as string;
          }

          const response = await client.device.share({
            user,
            deviceidList: [deviceId],
            permit,
          });
          responseData = safeResponse(response, operation, { deviceId, shareMethod, permit });
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

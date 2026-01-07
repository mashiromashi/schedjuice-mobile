import { queryParamDefault } from '@/config/defaults';
import { filterParamsBody, queryParamOptions } from '@/types/api';
import { Buffer } from 'buffer';
import { axiosClient } from '../api';

export function encodeArrayToBase64(array: Array<string>) {
  return Buffer.from(JSON.stringify(array)).toString('base64');
}
export function encodeQueryData(data: any) {
  const ret = [];
  for (let d in data) ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
  return '?' + ret.join('&');
}

export const makeSearchParams = (queryParams: queryParamOptions) => {
  const data: any = {
    page: String(queryParams.page || queryParamDefault.page),
    size: String(queryParams.size || queryParamDefault.size),
    sorts: encodeArrayToBase64(queryParams.sorts || []),
    expand: encodeArrayToBase64(queryParams.expand || []),
    csv: String(queryParams.csv || queryParamDefault.csv),
    group_by: queryParams.group_by || queryParamDefault.group_by,
    range: queryParams.range || undefined,
    range_group_by: queryParams.range_group_by || queryParamDefault.range_group_by,
  };
  if (queryParams.onlyFree) {
    data.onlyFree = queryParams.onlyFree;
  }
  if (queryParams.q) {
    data.q = queryParams.q;
  }
  if (queryParams.all) {
    data.all = queryParams.all;
  }
  if (queryParams?.fields?.length) {
    data.fields = encodeArrayToBase64(queryParams.fields || []);
  }
  return encodeQueryData(data);
};

export const fetchEntity = async (
  entity: string,
  entityId: number | string,
  expandParams: string[] = []
) => {
  return await axiosClient.get(`${entity}/${entityId}?expand=${encodeArrayToBase64(expandParams)}`);
};

export const fetchEntities = async (
  entity: string,
  queryParams: queryParamOptions = queryParamDefault
) => {
  return await axiosClient.get(entity + makeSearchParams(queryParams));
};

export const searchEntities = async (
  entity: string,
  queryParams: queryParamOptions = queryParamDefault,
  filterParams: filterParamsBody = {}
) => {
  return await axiosClient.post(`${entity}/search${makeSearchParams(queryParams)}`, filterParams);
};

export const makePostRequest = async (
  url: string,
  data: Object,
  queryParamOptions: queryParamOptions | any = queryParamDefault,
  headers: any = {}
) => {
  return await axiosClient.post(`${url}${makeSearchParams(queryParamOptions)}`, data, {
    headers: headers,
  });
};
export const makeGetRequest = async (url: string, queryParamOptions = queryParamDefault) => {
  return await axiosClient.get(`${url}${makeSearchParams(queryParamOptions)}`);
};

export const updateEntities = async (entity: string, data: Object) => {
  return await axiosClient.put(`${entity}`, data);
};

export const updateEntity = async (
  entity: string,
  entityId: number | string,
  data: Object,
  headers: any = {}
) => {
  return await axiosClient.put(`${entity}/${entityId}`, data, {
    headers: headers,
  });
};

export const deleteEntity = async (entity: string, entityId: number | string) => {
  return await axiosClient.delete(`${entity}/${entityId}`);
};

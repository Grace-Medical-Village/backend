export interface Id {
  id: string;
}

export interface Item extends Id {
  key: string;
}

export interface Options {
  region?: string;
  endpoint?: string;
}

export type HeaderType = 'Access-Control-Allow-Origin' | 'Access-Control-Allow-Credentials';
export type Header = {
  [key in HeaderType]: string | boolean;
};
export interface Response {
  statusCode?: number;
  headers?: Header;
  body?: string;
  error?: string;
}

export interface RequestBody extends Item {
  createdAt?: number;
  modifiedAt?: number;
}

export type DataType = string | number | boolean;
export interface ExpressionAttributeValue {
  [key: string]: DataType;
}

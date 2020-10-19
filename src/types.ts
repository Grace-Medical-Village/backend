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

export interface Response {
  statusCode?: number;
  error?: string;
  body?: string;
}

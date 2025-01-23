export enum HttpVerb {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export enum EndPoint {
  AGENTS_LIST = 'agents/list',
  DISTRICTS_LIST = 'Districts/list',
  INSTALLATIONS = 'Dashboard/InstallationPage',
  GET_AGENTS_BY_DISTRICT_ID = 'Districts/Contractors',
  RETIRED_METERS = 'Meters/retired',
}

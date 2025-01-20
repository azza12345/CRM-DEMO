export enum HttpVerb {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export enum EndPoint {
  CONTRACTORS = 'Lockups/agents',
  GET_CONTRACTORS_BY_DISTRICT_ID = 'Districts/Contractors',
  RETIRED_METERS = 'Meters/retired',
  INSTALLATIONS = 'Dashboard/InstallationPage',
  MOCK_CONTRACTORS = 'mock/contractors.mock.json',
  MOCK_RETIRED_METERS = 'mock/retired-meters.mock.json',
  MOCK_INSTALLATIONS = 'mock/installations.mock.json',
  GET_DISTRICTS = 'Districts/all',
}

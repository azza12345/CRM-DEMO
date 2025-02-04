export enum HttpVerb {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export enum EndPoint {
  AGENTS_LIST = 'agents/list',
  DISTRICTS_LIST = 'Districts/ActiveDistrics/list',
  INSTALLATIONS = 'Dashboard/InstallationPage',
  GET_AGENTS_BY_DISTRICT_ID = 'Districts/Contractors',
  RETIRED_METERS = 'Meters/retired',
  DISTRICTS = 'Districts/all',
  METERS_STATISTICS = 'meters/statistics',
  RETIRED_METER_STATISTICS = 'meters/retired/status/district',
  AGENTS_OPERATIONS_STATISTICS = 'agents/operations/statistics',
  //FIXME: gonna be changed when API is Ready
  MOCK_AGENTS = './mock/agents.mock.json',
}

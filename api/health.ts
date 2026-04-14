import { dataApiRequest, getMongoDatabaseName } from './_lib/mongodb';

type ApiRequest = { method?: string };
type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (payload: unknown) => void;
};

export default async function handler(_req: ApiRequest, res: ApiResponse) {
  try {
    await dataApiRequest('findOne', {
      collection: 'memory_nodes',
      filter: {},
    });

    res.status(200).json({
      ok: true,
      service: 'proprofile-api',
      db: getMongoDatabaseName(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Database connectivity check failed.',
    });
  }
}

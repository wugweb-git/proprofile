import https from 'node:https';

type DataApiBody = {
  dataSource: string;
  database: string;
  collection?: string;
  filter?: Record<string, unknown>;
  sort?: Record<string, 1 | -1>;
  limit?: number;
  document?: Record<string, unknown>;
};

const endpoint = process.env.MONGODB_DATA_API_URL;
const apiKey = process.env.MONGODB_DATA_API_KEY;
const mongoUri = process.env.MONGODB_URI;
const dataSource = process.env.MONGODB_DATA_SOURCE || 'Cluster0';
const database = process.env.MONGODB_DB || 'proprofile';

declare global {
  // eslint-disable-next-line no-var
  var __atlasDataApiAgent__: https.Agent | undefined;
}

const getKeepAliveAgent = () => {
  if (!global.__atlasDataApiAgent__) {
    global.__atlasDataApiAgent__ = new https.Agent({
      keepAlive: true,
      maxSockets: 16,
      maxFreeSockets: 8,
      timeout: 30_000,
    });
  }

  return global.__atlasDataApiAgent__;
};

const assertConfig = () => {
  if (!endpoint || !apiKey) {
    if (mongoUri) {
      throw new Error('MONGODB_URI is set, but this deployment path uses Atlas Data API. Configure MONGODB_DATA_API_URL and MONGODB_DATA_API_KEY.');
    }

    throw new Error('Missing MongoDB Data API config (MONGODB_DATA_API_URL, MONGODB_DATA_API_KEY).');
  }
};

const postJson = <T>(url: string, headers: Record<string, string>, body: string): Promise<T> => {
  const parsed = new URL(url);

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        port: parsed.port || 443,
        path: `${parsed.pathname}${parsed.search}`,
        method: 'POST',
        headers: {
          ...headers,
          'Content-Length': Buffer.byteLength(body),
        },
        agent: getKeepAliveAgent(),
      },
      (res) => {
        let data = '';

        res.on('data', (chunk: Buffer) => {
          data += chunk.toString('utf8');
        });

        res.on('end', () => {
          const status = res.statusCode ?? 500;

          if (status < 200 || status >= 300) {
            reject(new Error(`Mongo Data API request failed (${status}): ${data}`));
            return;
          }

          try {
            resolve(JSON.parse(data) as T);
          } catch {
            reject(new Error('Mongo Data API returned invalid JSON response.'));
          }
        });
      },
    );

    req.on('error', reject);
    req.write(body);
    req.end();
  });
};

export const getMongoDatabaseName = () => database;

export const dataApiRequest = async <T>(action: string, body: Omit<DataApiBody, 'dataSource' | 'database'>): Promise<T> => {
  assertConfig();

  return postJson<T>(
    `${endpoint}/action/${action}`,
    {
      'Content-Type': 'application/json',
      'api-key': apiKey as string,
    },
    JSON.stringify({
      dataSource,
      database,
      ...body,
    }),
  );
};

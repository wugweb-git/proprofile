const endpoint = process.env.MONGODB_DATA_API_URL;
const apiKey = process.env.MONGODB_DATA_API_KEY;
const dataSource = process.env.MONGODB_DATA_SOURCE || 'Cluster0';
const database = process.env.MONGODB_DB || 'proprofile';
const mongoUri = process.env.MONGODB_URI;

if ((!endpoint || !apiKey) && mongoUri) {
  const isValidUri = /^mongodb(\+srv)?:\/\//.test(mongoUri);
  if (!isValidUri) {
    console.error('[db-smoke] FAIL: MONGODB_URI is set but malformed.');
    process.exit(1);
  }

  console.log('[db-smoke] WARN: MONGODB_URI detected. This repository currently validates DB connectivity via Atlas Data API.');
  console.log('[db-smoke] WARN: Set MONGODB_DATA_API_URL and MONGODB_DATA_API_KEY to run live connectivity smoke tests.');
  process.exit(0);
}

if (!endpoint || !apiKey) {
  console.log('[db-smoke] SKIP: MONGODB_DATA_API_URL or MONGODB_DATA_API_KEY is not set.');
  process.exit(0);
}

const url = `${endpoint}/action/findOne`;
const body = {
  dataSource,
  database,
  collection: 'memory_nodes',
  filter: {},
};

try {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`[db-smoke] FAIL: ${response.status} ${text}`);
    process.exit(1);
  }

  const json = await response.json();
  console.log('[db-smoke] PASS: Atlas Data API reachable.');
  console.log(`[db-smoke] Database: ${database}, datasource: ${dataSource}.`);
  console.log(`[db-smoke] Sample document present: ${Boolean(json.document)}.`);
} catch (error) {
  console.error('[db-smoke] FAIL:', error instanceof Error ? error.message : error);
  process.exit(1);
}

import { dataApiRequest } from './_lib/mongodb';

type ApiRequest = {
  method?: string;
  query: Record<string, string | string[] | undefined>;
  body?: {
    source?: string;
    content?: string;
    state?: string;
    tags?: string[];
  };
};

type ApiResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => ApiResponse;
  json: (payload: unknown) => void;
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  try {
    if (req.method === 'GET') {
      const rawLimit = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
      const parsedLimit = Number(rawLimit ?? 25);
      const limit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 100) : 25;

      const result = await dataApiRequest<{ documents: unknown[] }>('find', {
        collection: 'memory_nodes',
        filter: {},
        sort: { createdAt: -1 },
        limit,
      });

      return res.status(200).json({ ok: true, data: result.documents ?? [] });
    }

    if (req.method === 'POST') {
      const payload = req.body;

      if (!payload?.content || !payload?.source) {
        return res.status(400).json({ ok: false, error: 'content and source are required.' });
      }

      const doc = {
        source: payload.source,
        content: payload.content,
        state: payload.state ?? 'HOLD',
        tags: Array.isArray(payload.tags) ? payload.tags : [],
        createdAt: new Date().toISOString(),
      };

      const result = await dataApiRequest<{ insertedId: string }>('insertOne', {
        collection: 'memory_nodes',
        document: doc,
      });

      return res.status(201).json({ ok: true, id: result.insertedId });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false, error: `Method ${req.method} not allowed.` });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Unexpected server error.',
    });
  }
}

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * MakStat — State Statistical Office of North Macedonia, PxWeb MCP.
 *
 * Keyless PxWeb API. Note the /MakStat database segment after /en. Tables
 * carry a ".px" suffix (item type "t"); folders have type "l". The PxWeb
 * backend enforces a per-query cell limit, so query_table should narrow
 * dimensions via the body's query selections rather than pulling everything.
 */


const BASE = 'https://makstat.stat.gov.mk/PXWeb/api/v1/en/MakStat';
const UA = 'pipeworx-mcp-makstat-mk/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'subjects',
    description: 'Navigate the subject tree. Items have type "l" (folder) or "t" (table, .px suffix).',
    inputSchema: {
      type: 'object',
      properties: { path: { type: 'string', description: 'Sub-path under /MakStat/ (default empty = root, returns top-level folders).' } },
    },
  },
  {
    name: 'table_meta',
    description: 'Table definition (dimensions, valid values). Path must end in the ".px" table id.',
    inputSchema: {
      type: 'object',
      properties: { path: { type: 'string', description: 'e.g. "Naselenie/VencaniRazvedeni/280_VitStat_Brak_voz_ml.px"' } },
      required: ['path'],
    },
  },
  {
    name: 'query_table',
    description: 'Pull data from a table. body is a PxWeb query object. Narrow dimensions to stay under the PxWeb cell limit.',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'e.g. "Naselenie/VencaniRazvedeni/280_VitStat_Brak_voz_ml.px"' },
        body: { type: 'object', description: '{query: [{code, selection: {filter, values}}], response: {format: "json-stat2"}}' },
      },
      required: ['path', 'body'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'subjects': {
      const path = (args.path as string | undefined)?.replace(/^\/+|\/+$/g, '') ?? '';
      return makstatGet(path ? `/${path}` : '');
    }
    case 'table_meta':
      return makstatGet(`/${reqStr(args, 'path', '"Naselenie/VencaniRazvedeni/280_VitStat_Brak_voz_ml.px"').replace(/^\/+|\/+$/g, '')}`);
    case 'query_table': {
      const path = reqStr(args, 'path', '"Naselenie/VencaniRazvedeni/280_VitStat_Brak_voz_ml.px"').replace(/^\/+|\/+$/g, '');
      const body = args.body;
      if (!body || typeof body !== 'object') throw new Error('body must be a PxWeb query object.');
      const res = await fetch(`${BASE}/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': UA },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`MakStat: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
      return res.json();
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function makstatGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (!res.ok) throw new Error(`MakStat: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;

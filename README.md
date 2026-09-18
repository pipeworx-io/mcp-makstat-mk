# mcp-makstat-mk

MakStat — State Statistical Office of North Macedonia, PxWeb MCP.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `subjects` | Browse the North Macedonia State Statistical Office (MakStat) PxWeb subject tree under the /MakStat database. Empty path returns top-level folders (type 'l'); drill with sub-paths to reach tables (type 't', '.px' suffix). Returns folder/table list for the given path. |
| `table_meta` | Fetch dimension definitions and valid coded values for a MakStat PxWeb table. Path must end in the '.px' table id (e.g. 'Naselenie/VencaniRazvedeni/280_VitStat_Brak_voz_ml.px'). Returns dimensions with their codes and value lists — use these to build the selection body for query_table. |
| `query_table` | POST a PxWeb query to a MakStat (North Macedonia statistics) table and return observations as json-stat2. body must be {query:[{code, selection:{filter,values}}], response:{format:'json-stat2'}}. PxWeb enforces a cell-count limit — narrow each dimension's values using codes from table_meta to avoid rejection. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "makstat-mk": {
      "url": "https://gateway.pipeworx.io/makstat-mk/mcp"
    }
  }
}
```

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/makstat-mk/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Makstat Mk data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT

## No MCP client? Call it over HTTP

```bash
curl -X POST https://gateway.pipeworx.io/v1/tools/makstat_mk_subjects \
  -H 'Content-Type: application/json' \
  -d '{"path":""}'
```

No account needed for the first calls. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/makstat_mk_subjects`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.

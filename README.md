# mcp-makstat-mk

MakStat — State Statistical Office of North Macedonia, PxWeb MCP.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Makstat Mk data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT

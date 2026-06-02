# mcp-makstat-mk

MakStat — State Statistical Office of North Macedonia, PxWeb MCP.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 693+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `subjects` | Navigate the subject tree. Items have type "l" (folder) or "t" (table, .px suffix). |
| `table_meta` | Table definition (dimensions, valid values). Path must end in the ".px" table id. |
| `query_table` | Pull data from a table. body is a PxWeb query object. Narrow dimensions to stay under the PxWeb cell limit. |

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

Or connect to the full Pipeworx gateway for access to all 693+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT

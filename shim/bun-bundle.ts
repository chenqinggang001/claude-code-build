/**
 * Shim for bun:bundle's feature() function.
 * Selectively enables features that have complete source code available.
 */
const ENABLED_FLAGS = new Set([
  'AGENT_TRIGGERS',      // Cron tools
  'AGENT_TRIGGERS_REMOTE', // Remote triggers
  'EXTRACT_MEMORIES',    // Memory auto-extraction
  'TOKEN_BUDGET',        // Token budget tracking
  'CHICAGO_MCP',         // Computer Use MCP
  'COMMIT_ATTRIBUTION',  // Commit attribution
  'MCP_RICH_OUTPUT',     // MCP rich output
]);

export function feature(name: string): boolean {
  return ENABLED_FLAGS.has(name);
}

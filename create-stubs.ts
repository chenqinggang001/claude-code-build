/**
 * Creates stub modules for feature-gated internal modules
 * that don't exist in the restored source.
 */
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';

const SRC = join(import.meta.dir, 'src');

const STUB = `export default {};`;

const stubs: Record<string, string> = {
  // Proactive / KAIROS / Assistant
  'proactive/index.ts': 'export const isProactiveActive = () => false; export default {};',
  'assistant/index.ts': 'export const isAssistantMode = () => false; export const getAssistantActivationPath = () => undefined; export default {};',
  'assistant/gate.ts': 'export const isKairosGateOpen = () => false; export default {};',
  'assistant/sessionDiscovery.ts': STUB,

  // Server / Direct Connect
  'server/parseConnectUrl.ts': STUB,
  'server/server.ts': STUB,
  'server/serverBanner.ts': STUB,
  'server/serverLog.ts': STUB,
  'server/sessionManager.ts': STUB,
  'server/lockfile.ts': STUB,
  'server/connectHeadless.ts': STUB,
  'server/backends/dangerousBackend.ts': STUB,

  // SSH
  'ssh/createSSHSession.ts': STUB,

  // Coordinator
  'coordinator/workerAgent.ts': STUB,

  // Feature-gated tools
  'tools/OverflowTestTool/OverflowTestTool.ts': 'export default {};',
  'tools/TerminalCaptureTool/TerminalCaptureTool.ts': 'export default {};',
  'tools/TerminalCaptureTool/prompt.ts': 'export const TERMINAL_CAPTURE_TOOL_NAME = "TerminalCapture";',
  'tools/VerifyPlanExecutionTool/VerifyPlanExecutionTool.ts': 'export default {};',
  'tools/VerifyPlanExecutionTool/constants.ts': 'export const VERIFY_PLAN_EXECUTION_TOOL_NAME = "VerifyPlanExecution";',
  'tools/WorkflowTool/WorkflowTool.ts': 'export default {};',
  'tools/WorkflowTool/constants.ts': 'export const WORKFLOW_TOOL_NAME = "Workflow";',
  'tools/WorkflowTool/bundled/index.ts': STUB,
  'tools/WorkflowTool/createWorkflowCommand.ts': STUB,
  'tools/MonitorTool/MonitorTool.ts': 'export default {};',
  'tools/SleepTool/SleepTool.ts': 'export default {};',
  'tools/REPLTool/REPLTool.ts': 'export default {};',
  'tools/ListPeersTool/ListPeersTool.ts': 'export default {};',
  'tools/SnipTool/SnipTool.ts': 'export default {};',
  'tools/SnipTool/prompt.ts': 'export const SNIP_TOOL_NAME = "Snip";',
  'tools/CtxInspectTool/CtxInspectTool.ts': 'export default {};',
  'tools/WebBrowserTool/WebBrowserTool.ts': 'export default {};',
  'tools/SendUserFileTool/SendUserFileTool.ts': 'export default {};',
  'tools/SendUserFileTool/prompt.ts': 'export const SEND_USER_FILE_TOOL_NAME = "SendUserFile";',
  'tools/PushNotificationTool/PushNotificationTool.ts': 'export default {};',
  'tools/SubscribePRTool/SubscribePRTool.ts': 'export default {};',
  'tools/SuggestBackgroundPRTool/SuggestBackgroundPRTool.ts': 'export default {};',
  'tools/TungstenTool/TungstenTool.ts': 'export default {};',
  'tools/DiscoverSkillsTool/prompt.ts': 'export const DISCOVER_SKILLS_TOOL_NAME = "DiscoverSkills";',

  // Feature-gated services
  'services/compact/cachedMCConfig.ts': 'export const getCachedMCConfig = () => ({ enabled: false, keepRecent: 5, supportedModels: [], systemPromptSuggestSummaries: false });',
  'services/compact/cachedMicrocompact.ts': STUB,
  'services/compact/reactiveCompact.ts': STUB,
  'services/compact/snipCompact.ts': STUB,
  'services/compact/snipProjection.ts': STUB,
  'services/contextCollapse/index.ts': STUB,
  'services/sessionTranscript/sessionTranscript.ts': STUB,
  'services/skillSearch/featureCheck.ts': 'export const isSkillSearchEnabled = () => false;',
  'services/skillSearch/prefetch.ts': STUB,
  'services/skillSearch/localSearch.ts': STUB,

  // Feature-gated commands
  'commands/proactive.ts': STUB,
  'commands/buddy/index.ts': STUB,
  'commands/assistant/index.ts': STUB,
  'commands/fork/index.ts': STUB,
  'commands/peers/index.ts': STUB,
  'commands/subscribe-pr.ts': STUB,
  'commands/torch.ts': STUB,
  'commands/workflows/index.ts': STUB,
  'commands/agents-platform/index.ts': STUB,
  'commands/force-snip.ts': STUB,
  'commands/remoteControlServer/index.ts': STUB,

  // Types
  'types/connectorText.ts': 'export type ConnectorTextBlock = { type: "connector_text"; text: string }; export type ConnectorTextDelta = { type: "connector_text_delta"; text: string }; export const isConnectorTextBlock = (_: any): _ is ConnectorTextBlock => false;',

  // Components
  'components/agents/SnapshotUpdateDialog.ts': STUB,

  // Skills
  'skills/mcpSkills.ts': STUB,

  // Utils
  'utils/systemThemeWatcher.ts': 'export const getSystemTheme = () => "dark"; export const onSystemThemeChange = () => () => {};',
  'utils/taskSummary.ts': STUB,

  // Jobs
  'jobs/classifier.ts': STUB,

  // Yolo classifier prompts (text files)
  'yolo-classifier-prompts/auto_mode_system_prompt.txt': '',
  'yolo-classifier-prompts/permissions_anthropic.txt': '',
  'yolo-classifier-prompts/permissions_external.txt': '',

  // Entrypoint stubs
  'entrypoints/sdk/coreSchemas.ts': STUB,
  'entrypoints/sdk/runtimeTypes.ts': STUB,
  'entrypoints/sdk/toolTypes.ts': STUB,

  // Other missing
  'attributionTrailer.ts': 'export const getAttributionTrailer = () => "";',
  'devtools.ts': STUB,
  'coreTypes.generated.ts': STUB,
  'protectedNamespace.ts': 'export const isProtectedNamespace = () => false;',
};

let created = 0;
for (const [relPath, content] of Object.entries(stubs)) {
  const fullPath = join(SRC, relPath);
  if (!existsSync(fullPath)) {
    mkdirSync(dirname(fullPath), { recursive: true });
    writeFileSync(fullPath, content, 'utf8');
    created++;
  }
}

console.log(`Created ${created} stub modules (${Object.keys(stubs).length - created} already existed)`);

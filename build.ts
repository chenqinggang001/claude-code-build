/**
 * Build script for Claude Code from restored source.
 * Uses Bun's bundler with all feature flags set to false (external build).
 */
import { readFileSync } from 'fs';

// All feature flags extracted from source - set to false for external build
const FEATURE_FLAGS = [
  'ABLATION_BASELINE', 'AGENT_MEMORY_SNAPSHOT', 'AGENT_TRIGGERS',
  'AGENT_TRIGGERS_REMOTE', 'ALLOW_TEST_VERSIONS', 'ANTI_DISTILLATION_CC',
  'AUTO_THEME', 'AWAY_SUMMARY', 'BASH_CLASSIFIER', 'BG_SESSIONS',
  'BREAK_CACHE_COMMAND', 'BRIDGE_MODE', 'BUDDY', 'BUILDING_CLAUDE_APPS',
  'BUILTIN_EXPLORE_PLAN_AGENTS', 'BYOC_ENVIRONMENT_RUNNER',
  'CACHED_MICROCOMPACT', 'CCR_AUTO_CONNECT', 'CCR_MIRROR', 'CCR_REMOTE_SETUP',
  'CHICAGO_MCP', 'COMMIT_ATTRIBUTION', 'COMPACTION_REMINDERS',
  'CONNECTOR_TEXT', 'CONTEXT_COLLAPSE', 'COORDINATOR_MODE',
  'COWORKER_TYPE_TELEMETRY', 'DAEMON', 'DIRECT_CONNECT',
  'DOWNLOAD_USER_SETTINGS', 'DUMP_SYSTEM_PROMPT', 'ENHANCED_TELEMETRY_BETA',
  'EXPERIMENTAL_SKILL_SEARCH', 'EXTRACT_MEMORIES', 'FILE_PERSISTENCE',
  'FORK_SUBAGENT', 'HARD_FAIL', 'HISTORY_PICKER', 'HISTORY_SNIP',
  'HOOK_PROMPTS', 'IS_LIBC_GLIBC', 'IS_LIBC_MUSL', 'KAIROS',
  'KAIROS_BRIEF', 'KAIROS_CHANNELS', 'KAIROS_DREAM',
  'KAIROS_GITHUB_WEBHOOKS', 'KAIROS_PUSH_NOTIFICATION', 'LODESTONE',
  'MCP_RICH_OUTPUT', 'MCP_SKILLS', 'MEMORY_SHAPE_TELEMETRY',
  'MESSAGE_ACTIONS', 'MONITOR_TOOL', 'NATIVE_CLIENT_ATTESTATION',
  'NATIVE_CLIPBOARD_IMAGE', 'NEW_INIT', 'OVERFLOW_TEST_TOOL',
  'PERFETTO_TRACING', 'POWERSHELL_AUTO_MODE', 'PROACTIVE',
  'PROMPT_CACHE_BREAK_DETECTION', 'QUICK_SEARCH', 'REACTIVE_COMPACT',
  'REVIEW_ARTIFACT', 'RUN_SKILL_GENERATOR', 'SELF_HOSTED_RUNNER',
  'SHOT_STATS', 'SKILL_IMPROVEMENT', 'SLOW_OPERATION_LOGGING', 'SSH_REMOTE',
  'STREAMLINED_OUTPUT', 'TEAMMEM', 'TEMPLATES', 'TERMINAL_PANEL',
  'TOKEN_BUDGET', 'TORCH', 'TRANSCRIPT_CLASSIFIER', 'TREE_SITTER_BASH',
  'TREE_SITTER_BASH_SHADOW', 'UDS_INBOX', 'ULTRAPLAN', 'ULTRATHINK',
  'UNATTENDED_RETRY', 'UPLOAD_USER_SETTINGS', 'VERIFICATION_AGENT',
  'VOICE_MODE', 'WEB_BROWSER_TOOL', 'WORKFLOW_SCRIPTS',
];

const FEATURE_SET = new Set(FEATURE_FLAGS);

const define: Record<string, string> = {
  'MACRO.VERSION': JSON.stringify('2.1.88-custom'),
  'MACRO.ISSUES_EXPLAINER': JSON.stringify('report the issue at https://github.com/anthropics/claude-code/issues'),
  'MACRO.PACKAGE_URL': JSON.stringify('@anthropic-ai/claude-code'),
  'MACRO.README_URL': JSON.stringify('https://code.claude.com/docs/en/overview'),
  'MACRO.FEEDBACK_CHANNEL': JSON.stringify('https://github.com/anthropics/claude-code/issues'),
  'MACRO.BUILD_TIME': JSON.stringify(new Date().toISOString()),
};

console.log('Building Claude Code from restored source...');
console.log(`Feature flags: ${FEATURE_FLAGS.length} (all set to false)`);

const result = await Bun.build({
  entrypoints: ['./src/entrypoints/cli.tsx'],
  outdir: './dist',
  target: 'node',
  format: 'esm',
  sourcemap: 'linked',
  minify: false,
  define,
  external: [
    // Only mark packages as external if they are:
    // 1. Actually installed in node_modules, OR
    // 2. Only used in dynamic import() paths that won't be reached
    // Native addons that may or may not be present
    'sharp',
    'audio-capture-napi',
    'image-processor-napi',
    'modifiers-napi',
    'url-handler-napi',
  ],
  plugins: [
    {
      name: 'bun-bundle-shim',
      setup(build) {
        // Resolve bun:bundle to our shim module
        build.onResolve({ filter: /^bun:bundle$/ }, () => ({
          path: import.meta.dir + '/shim/bun-bundle.ts',
        }));
      },
    },
    {
      name: 'missing-module-stub',
      setup(build) {
        const path = require('path');
        const fs = require('fs');
        const projectRoot = import.meta.dir;

        // Handle .txt file imports - return empty string
        build.onResolve({ filter: /\.txt$/ }, (args: any) => ({
          path: args.path,
          namespace: 'stub-txt',
        }));
        build.onLoad({ filter: /.*/, namespace: 'stub-txt' }, () => ({
          contents: 'export default "";',
          loader: 'js',
        }));

        // Handle .d.ts imports - return empty module
        build.onResolve({ filter: /\.d\.ts$/ }, (args: any) => ({
          path: args.path,
          namespace: 'stub-dts',
        }));
        build.onLoad({ filter: /.*/, namespace: 'stub-dts' }, () => ({
          contents: '',
          loader: 'js',
        }));

        // Redirect color-diff-napi to pure TS implementation
        build.onResolve({ filter: /^color-diff-napi$/ }, () => ({
          path: path.resolve(projectRoot, 'src/native-ts/color-diff/index.ts'),
        }));

        // Stub uninstalled npm packages (not in node_modules)
        const STUB_NPM_PACKAGES = [
          '@azure/identity',
          '@anthropic-ai/claude-agent-sdk',
          'galactus', 'pretty-bytes', 'node-forge', '@inquirer/prompts',
          '@opentelemetry/exporter-logs-otlp-grpc', '@opentelemetry/exporter-logs-otlp-proto',
          '@opentelemetry/exporter-metrics-otlp-grpc', '@opentelemetry/exporter-metrics-otlp-http',
          '@opentelemetry/exporter-metrics-otlp-proto', '@opentelemetry/exporter-prometheus',
          '@opentelemetry/exporter-trace-otlp-grpc', '@opentelemetry/exporter-trace-otlp-proto',
        ];
        build.onResolve({ filter: /.*/ }, (args: any) => {
          if (args.namespace.startsWith('stub-')) return;
          for (const pkg of STUB_NPM_PACKAGES) {
            if (args.path === pkg || args.path.startsWith(pkg + '/')) {
              return { path: args.path, namespace: 'stub-npm' };
            }
          }
        });
        build.onLoad({ filter: /.*/, namespace: 'stub-npm' }, (args: any) => {
          // Return a Proxy-based stub that handles any named import
          return {
            contents: `
              const handler = { get: (t, p) => p === '__esModule' ? true : () => {} };
              const stub = new Proxy({}, handler);
              export default stub;
              export const __stub__ = true;
              export const confirm = () => {};
              export const input = () => {};
              export const select = () => {};
              export const DestroyerOfModules = class {};
            `,
            loader: 'js',
          };
        });

        // Resolve bare 'src/' imports to actual files in the project
        build.onResolve({ filter: /^src\// }, (args: any) => {
          if (args.namespace.startsWith('stub-')) return;
          // Resolve relative to project root
          const resolved = path.resolve(projectRoot, args.path);
          const extensions = ['', '.ts', '.tsx', '.js', '.jsx'];
          for (const ext of extensions) {
            if (fs.existsSync(resolved + ext)) {
              return { path: resolved + ext };
            }
          }
          // Also try stripping .js/.jsx extension and trying .ts/.tsx
          const withoutJs = resolved.replace(/\.jsx?$/, '');
          const tsExtensions = ['.ts', '.tsx', '/index.ts', '/index.tsx', '/index.js'];
          for (const ext of tsExtensions) {
            if (fs.existsSync(withoutJs + ext)) {
              return { path: withoutJs + ext };
            }
          }
          // Not found - stub it
          return { path: resolved, namespace: 'stub-missing' };
        });

        // Stub any relative module that Bun can't resolve (missing files behind feature flags)
        build.onResolve({ filter: /^\./ }, (args: any) => {
          // Skip if already in a stub namespace
          if (args.namespace.startsWith('stub-')) return;

          const resolved = path.resolve(args.resolveDir, args.path);

          // Check common extensions
          const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '/index.js'];
          for (const ext of extensions) {
            if (fs.existsSync(resolved + ext)) return; // file exists, let Bun handle it
          }
          // Also try stripping .js/.jsx and trying .ts/.tsx
          const withoutJsExt = resolved.replace(/\.jsx?$/, '');
          const tsExtensions = ['.ts', '.tsx', '/index.ts', '/index.tsx'];
          for (const ext of tsExtensions) {
            if (fs.existsSync(withoutJsExt + ext)) return;
          }

          // File doesn't exist - return stub
          return {
            path: resolved,
            namespace: 'stub-missing',
          };
        });

        build.onLoad({ filter: /.*/, namespace: 'stub-missing' }, (args: any) => {
          // Read the original file if it exists to extract export names
          // For truly missing files, provide a Proxy-based default export
          let exportNames: string[] = [];
          const origPath = args.path;
          // Try to find corresponding source to extract named exports
          const tryPaths = [origPath, origPath + '.ts', origPath + '.tsx',
            origPath.replace(/\.js$/, '.ts'), origPath.replace(/\.js$/, '.tsx')];
          for (const p of tryPaths) {
            if (fs.existsSync(p)) {
              try {
                const src = fs.readFileSync(p, 'utf8');
                // Extract export names from source
                const exportMatches = src.matchAll(/export\s+(?:const|let|var|function|class|async\s+function|enum|type|interface)\s+(\w+)/g);
                for (const m of exportMatches) {
                  if (m[1] && m[1] !== 'default') exportNames.push(m[1]);
                }
                // Also extract re-exports like: export { Foo, Bar }
                const reExportMatches = src.matchAll(/export\s*\{([^}]+)\}/g);
                for (const m of reExportMatches) {
                  const names = m[1]!.split(',').map(n => n.trim().split(/\s+as\s+/).pop()!.trim());
                  exportNames.push(...names.filter(n => n && n !== 'default'));
                }
              } catch {}
              break;
            }
          }

          // .md files should export their content as a string (default export)
          if (args.path.endsWith('.md')) {
            return {
              contents: `export default ''; export const __stub__ = true;`,
              loader: 'js',
            };
          }

          const namedExports = [...new Set(exportNames)]
            .map(name => `export const ${name} = undefined;`)
            .join('\n');

          return {
            contents: `
              export default {};
              export const __stub__ = true;
              ${namedExports}
            `,
            loader: 'js',
          };
        });
      },
    },
  ],
});

if (!result.success) {
  console.error('\nBuild failed with errors:');
  let shown = 0;
  for (const log of result.logs) {
    if (shown < 30) {
      console.error(log.message ?? log);
      shown++;
    }
  }
  if (result.logs.length > 30) {
    console.error(`\n... and ${result.logs.length - 30} more errors`);
  }
  console.error(`\nTotal errors: ${result.logs.length}`);
  process.exit(1);
} else {
  console.log(`\nBuild succeeded!`);
  console.log(`Output: ${result.outputs.map(o => o.path).join(', ')}`);
  console.log(`\nTo run:`);
  console.log(`  ANTHROPIC_API_KEY=your-key node dist/cli.js`);
  console.log(`  # Or with custom endpoint:`);
  console.log(`  ANTHROPIC_BASE_URL=https://your-endpoint.com ANTHROPIC_API_KEY=your-key node dist/cli.js`);
}

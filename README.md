# Claude Code Build (Unofficial)

> **⚠️ WARNING**: This repository is unofficial and is reconstructed from the public npm package and source map analysis, for research purposes only. It does not represent the original internal development repository structure.
>
> **Copyright**: All original source code copyrights belong to **Anthropic, PBC**.
> This repository is for technical research and learning purposes only. **Commercial use is strictly prohibited.**
> If this repository infringes upon any rights, please contact for immediate removal.

> **Version**: 2.1.88-custom
>
> **Status**: 非官方构建 / Unofficial Build

## 简介

本项目基于 Claude Code CLI (Anthropic 官方命令行工具) 泄漏的源码进行编译构建。通过 Bun 打包工具将 TypeScript 源码编译为可运行的 Node.js 应用。

**这不是官方发布版本**，仅供学习研究用途。

## 构建与运行

### 前置依赖

- [Bun](https://bun.sh/) (用于构建)
- [Node.js](https://nodejs.org/) >= 18 (用于运行)

### 构建

```bash
bun install
bun run build
```

### 运行

```bash
# 使用 Anthropic API Key
ANTHROPIC_API_KEY=your-key node dist/cli.js

# 使用自定义 API 端点 (兼容 OpenAI 格式的第三方服务等)
ANTHROPIC_BASE_URL=https://your-endpoint.com ANTHROPIC_API_KEY=your-key node dist/cli.js
```

## 主要特性

- 所有实验性 Feature Flags 默认关闭
- 支持 Anthropic / AWS Bedrock / Google Vertex / Azure 等多种后端
- 支持 MCP (Model Context Protocol) 服务器
- 内置文件读写、搜索、Bash 执行等开发工具

## 项目结构

```
├── src/              # 源码目录
├── shim/             # Bun bundle shim
├── dist/             # 构建输出
├── build.ts          # 构建脚本
├── package.json      # 项目配置
└── tsconfig.json     # TypeScript 配置
```

---

## 免责声明 / Disclaimer

### 中文

1. **非官方产品**: 本项目 **不是** Anthropic 官方产品，与 Anthropic 公司无任何关联、授权或背书关系。
2. **来源说明**: 本项目基于网络上泄漏的 Claude Code 源码编译而成，作者不对源码的获取方式承担任何责任。
3. **仅供学习研究**: 本项目仅供个人学习、研究和技术交流目的使用，**严禁用于任何商业用途**。
4. **知识产权**: Claude Code 的原始源码、商标及相关知识产权归 **Anthropic, PBC** 所有。如 Anthropic 方面认为本项目侵犯其权益，请联系作者，将在第一时间删除。
5. **无担保**: 本项目按 **"原样"(AS IS)** 提供，不提供任何明示或暗示的保证，包括但不限于适销性、特定用途适用性及非侵权性的保证。
6. **风险自担**: 使用本项目产生的一切后果（包括但不限于数据丢失、账号封禁、API 费用、法律纠纷等）由使用者自行承担，作者不承担任何直接或间接责任。
7. **API 费用**: 使用本项目需要提供有效的 API Key，由此产生的所有 API 调用费用由使用者自行承担。
8. **安全风险**: 本项目未经 Anthropic 官方安全审计，可能存在安全漏洞或不可预见的行为。请勿在生产环境或处理敏感数据时使用。

### English

1. **Unofficial Product**: This project is **NOT** an official Anthropic product. It has no affiliation with, authorization from, or endorsement by Anthropic.
2. **Source Origin**: This project is compiled from leaked Claude Code source code found online. The author assumes no responsibility for how the source code was obtained.
3. **For Research Only**: This project is intended solely for personal learning, research, and technical discussion purposes. **Commercial use is strictly prohibited.**
4. **Intellectual Property**: The original Claude Code source code, trademarks, and related intellectual property belong to **Anthropic, PBC**. If Anthropic believes this project infringes upon their rights, please contact the author for immediate removal.
5. **No Warranty**: This project is provided **"AS IS"** without warranty of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.
6. **Use at Your Own Risk**: All consequences arising from the use of this project (including but not limited to data loss, account suspension, API charges, legal disputes, etc.) are solely the user's responsibility. The author assumes no direct or indirect liability.
7. **API Costs**: Using this project requires a valid API Key. All API usage charges incurred are the sole responsibility of the user.
8. **Security Risks**: This project has not undergone official security auditing by Anthropic and may contain security vulnerabilities or unpredictable behavior. Do not use in production environments or when handling sensitive data.

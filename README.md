# La-Z-Boy Agent Skills

The official repository for La-Z-Boy's AI agent skill library. This repo contains reusable skills for Claude Code, Cursor, and other AI coding agents used across the organization.

🌐 **Skill Portal:** [lazboy-agent-skills portal URL] — Browse, preview, and install skills without touching this repo.

---

## What is a Skill?

A skill is a structured knowledge file that tells an AI agent how to handle a specific domain — brand guidelines, code patterns, API conventions, design systems, and more. Instead of re-explaining the same rules every time, you install a skill once and your agent applies it automatically.

---

## Quick Install

### Prerequisites
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installed
- Git (for cloning the repo)

### One-time setup
```bash
git clone https://github.com/lzbtemp/lazboy-agent-skills.git
cd lazboy-agent-skills
```

### Install a skill globally (your machine, all projects)
```bash
./install.sh lazboy-brand --global
```

### Install a skill into a specific project
```bash
./install.sh lazboy-brand --project /path/to/your/project
```

### Install all skills globally
```bash
./install.sh --all --global
```

### Install for Cursor
```bash
./install.sh lazboy-brand --cursor --project /path/to/your/project
```

---

## Available Skills

| Skill | Description | Version | Cursor? |
|-------|-------------|---------|---------|
| [`lazboy-brand`](./skills/lazboy-brand/) | Brand colors, fonts, logo usage for all agent outputs | 1.0 | ✅ |
| [`lazboy-skill-standard`](./skills/lazboy-skill-standard/) | Org standard for creating and maintaining skills | 1.0 | — |
| [`lazboy-python-best-practices`](./skills/lazboy-python-best-practices/) | Python 3.12+ standards, tooling, testing, async patterns | 1.0 | ✅ |
| [`lazboy-playwright`](./skills/lazboy-playwright/) | Playwright E2E tests, Page Objects, fixtures, CI/CD setup | 1.0 | ✅ |
| [`lazboy-logging`](./skills/lazboy-logging/) | Application logging — structured JSON, correlation IDs, Python setup, security | 1.0 | ✅ |

> See the [Skill Portal] for a full browsable catalog with previews.

---

## Repo Structure

```
lazboy-agent-skills/
├── skills/                          # Claude Code skills (SKILL.md format)
│   ├── lazboy-brand/
│   ├── lazboy-skill-standard/
│   ├── lazboy-python-best-practices/
│   ├── lazboy-playwright/
│   └── lazboy-logging/
├── cursor-rules/                    # Cursor adaptations (.mdc format)
│   ├── lazboy-brand.mdc
│   ├── lazboy-python-best-practices.mdc
│   ├── lazboy-playwright.mdc
│   ├── lazboy-logging.mdc
│   └── README.md
├── install.sh                       # CLI installer for Claude Code + Cursor
├── docs/
│   ├── contributing.md
│   └── skill-anatomy.md
├── .github/
│   └── ISSUE_TEMPLATE/
└── README.md
```

---

## Contributing a New Skill

1. **Read the standard first:** [`skills/lazboy-skill-standard/SKILL.md`](./skills/lazboy-skill-standard/SKILL.md)
2. **Copy the template:** `cp -r skills/lazboy-skill-standard/assets/skill-template skills/your-skill-name`
3. **Build your skill** following the org standard
4. **Run the quality checklist** in `lazboy-skill-standard`
5. **Submit a PR** — fill out the skill submission template
6. **Get reviewed** by the skill owner for your domain

Full guide: [`docs/contributing.md`](./docs/contributing.md)

---

## Logging & Debugging

All scripts and tools support verbose/debug output for troubleshooting:

| Tool | How to enable | What it shows |
|------|--------------|---------------|
| **NPM CLI** | `--verbose` flag or `DEBUG=1` | HTTP requests, response times, file counts |
| **Bash installer** | `--verbose` flag | Source/dest paths, file counts per skill |
| **Python scripts** | `DEBUG=1` env var | File scan progress, timing, error details |

Examples:
```bash
# Debug CLI
npx @lazboy/skills add lazboy-brand --verbose

# Debug installer
./install.sh lazboy-brand --global --verbose

# Debug Python validator
DEBUG=1 python scripts/validate_brand.py src/
```

---

## Install Paths Reference

| Tool | Scope | Path |
|------|-------|------|
| Claude Code | Global | `~/.claude/skills/<skill-name>/` |
| Claude Code | Per-project | `<project>/.claude/skills/<skill-name>/` |
| Cursor | Per-project | `<project>/.cursor/rules/<skill-name>.mdc` |

---

## Questions?

- **Skill portal:** [URL]
- **Slack:** `#ai-agent-skills`
- **Submit a skill request:** [GitHub Issues](../../issues/new?template=skill-request.md)
- **Report a problem:** [GitHub Issues](../../issues/new?template=bug-report.md)

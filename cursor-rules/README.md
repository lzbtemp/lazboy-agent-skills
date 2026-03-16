# La-Z-Boy Cursor Rules

Cursor-compatible adaptations of the La-Z-Boy agent skills library.

## How to install

Copy the relevant `.mdc` files into your project's `.cursor/rules/` directory:

```bash
# From the lazboy-agent-skills repo root:
cp cursor-rules/lazboy-brand.mdc                   <your-project>/.cursor/rules/
cp cursor-rules/lazboy-python-best-practices.mdc   <your-project>/.cursor/rules/
cp cursor-rules/lazboy-playwright.mdc              <your-project>/.cursor/rules/
cp cursor-rules/lazboy-logging.mdc                 <your-project>/.cursor/rules/
```

Or install all at once:
```bash
mkdir -p <your-project>/.cursor/rules
cp cursor-rules/*.mdc <your-project>/.cursor/rules/
```

Cursor will automatically apply each rule based on the `globs` pattern in its frontmatter.

## How these differ from Claude Code skills

| | Claude Code (`SKILL.md`) | Cursor (`.mdc`) |
|---|---|---|
| Install location | `~/.claude/skills/` or `.claude/skills/` | `.cursor/rules/` in project |
| Triggering | Semantic (Claude reads description) | File globs or `alwaysApply` |
| References/ loading | On demand | All content in one file |
| Scripts | Can execute | Advisory only |
| Scope | Global or per-project | Per-project only |

## Available rules

| File | Applies to | Glob pattern |
|---|---|---|
| `lazboy-brand.mdc` | UI components, CSS, HTML | `**/*.tsx`, `**/*.css`, `**/*.html` |
| `lazboy-python-best-practices.mdc` | Python files | `**/*.py`, `**/pyproject.toml` |
| `lazboy-playwright.mdc` | Test files, Playwright config | `**/*.spec.ts`, `**/playwright.config.ts` |
| `lazboy-logging.mdc` | All source files (logging applies everywhere) | `**/*.py`, `**/*.ts`, `**/*.tsx` |

## Keeping in sync

When the canonical `skills/` SKILL.md files are updated, update the corresponding `.mdc` file in `cursor-rules/` to match. The `.mdc` files are condensed versions — focus on the core rules that should always be in context, and trim deep reference content that was in `references/` subdirectories.

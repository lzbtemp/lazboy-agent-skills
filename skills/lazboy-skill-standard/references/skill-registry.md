# La-Z-Boy Skill Registry

Central record of all agent skills in the La-Z-Boy organization.
Update this file whenever a skill is added, updated, or deprecated.

---

## Registry

| Skill Name | Version | Status | Purpose | Owner | Install Path | Last Updated |
|------------|---------|--------|---------|-------|-------------|--------------|
| `lazboy-brand` | 1.0 | ✅ Active | Brand colors, fonts, logo usage for all agent outputs | Marketing / Design | `.claude/skills/lazboy-brand/` | 2026-03 |
| `lazboy-skill-standard` | 1.0 | ✅ Active | Org standard for creating and maintaining skills | Engineering | `.claude/skills/lazboy-skill-standard/` | 2026-03 |

---

## Install Paths

### Global (applies to all projects on a machine)
```
Mac/Linux:  ~/.claude/skills/<skill-name>/
Windows:    %APPDATA%\Claude\skills\<skill-name>\
```

### Per-project (committed to repo, applies to all team members)
```
<project-root>/.claude/skills/<skill-name>/
```

### Cursor (per-project rules)
```
<project-root>/.cursor/rules/<skill-name>.mdc
```

---

## How to Register a New Skill

1. Build the skill following `lazboy-skill-standard`
2. Add a row to the Registry table above
3. Set Status to `🚧 Draft` until reviewed, then `✅ Active`
4. Submit a PR to this file for team awareness

## Status Legend
- `✅ Active` — production ready, use freely
- `🚧 Draft` — in development, not yet reviewed
- `⚠️ Needs Update` — underlying source has changed, skill needs refresh
- `❌ Deprecated` — do not use, see replacement skill in notes

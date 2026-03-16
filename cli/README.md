# @lazboy/skills — CLI

The La-Z-Boy Agent Skills CLI. Install AI agent skills into Claude Code and Cursor with one command.

## Usage

```bash
# List all available skills
npx @lazboy/skills list

# Install a skill into your current project
npx @lazboy/skills add lazboy-brand

# Install globally (works across all your projects)
npx @lazboy/skills add lazboy-brand --global

# Install for Cursor as well
npx @lazboy/skills add lazboy-brand --cursor

# Install into a specific project path
npx @lazboy/skills add lazboy-brand --project ~/projects/my-app

# Update a skill to the latest version
npx @lazboy/skills update lazboy-brand

# Remove a skill
npx @lazboy/skills remove lazboy-brand
```

## What it does

- Connects to the `lzbtemp/lazboy-agent-skills` GitHub repo
- Downloads **only** the skill folder you asked for
- Places it in `.claude/skills/<skill-name>/` for Claude Code
- Optionally generates a `.cursor/rules/<skill-name>.mdc` for Cursor
- No cloning the whole repo — just the skill you need

## Private repo setup

If the skills repo is private, set a GitHub token before running:

```bash
export GITHUB_TOKEN=your_personal_access_token
npx @lazboy/skills add lazboy-brand
```

To generate a token: GitHub → Settings → Developer Settings → Personal Access Tokens → Fine-grained → give it `contents: read` on the `lazboy-agent-skills` repo.

---

## Publishing this CLI (for maintainers)

### Publishing a new version

1. Update the version in `package.json`:
```bash
# For a small fix:
npm version patch   # 1.0.0 → 1.0.1

# For new features:
npm version minor   # 1.0.0 → 1.1.0
```

2. Publish to npm:
```bash
cd cli/
npm publish --access public
```

### After publishing

Anyone can now run:
```bash
npx @lazboy/skills list
npx @lazboy/skills add lazboy-brand
```

No setup, no tokens, no `.npmrc` config needed — it's a public npm package.

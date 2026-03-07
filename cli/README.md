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

- Connects to the `lazboy/lazboy-agent-skills` GitHub repo
- Downloads **only** the skill folder you asked for
- Places it in `.claude/skills/<skill-name>/` for Claude Code
- Optionally generates a `.cursor/rules/<skill-name>.mdc` for Cursor
- No cloning the whole repo — just the skill you need

## Private repo setup

If the repo is private, set a GitHub token before running:

```bash
export GITHUB_TOKEN=your_personal_access_token
npx @lazboy/skills add lazboy-brand
```

To generate a token: GitHub → Settings → Developer Settings → Personal Access Tokens → Fine-grained → give it `contents: read` on the `lazboy-agent-skills` repo.

---

## Publishing this CLI (for maintainers)

### First time setup

1. Make sure you're logged into GitHub Packages:
```bash
npm login --registry=https://npm.pkg.github.com --scope=@lazboy
# Username: your GitHub username
# Password: a GitHub token with write:packages permission
# Email: your email
```

2. Publish:
```bash
cd cli/
npm publish
```

### Publishing a new version

1. Update the version in `package.json`:
```bash
# For a small fix:
npm version patch   # 1.0.0 → 1.0.1

# For new features:
npm version minor   # 1.0.0 → 1.1.0
```

2. Publish:
```bash
npm publish
```

### After publishing

Anyone in the org can now run:
```bash
npx @lazboy/skills add lazboy-brand
```

---

## For users: one-time npm config

Because `@lazboy` is scoped to GitHub Packages (not the public npm registry), users need to tell npm where to find it. This is a **one-time setup per machine**:

```bash
# Add this to ~/.npmrc
echo "@lazboy:registry=https://npm.pkg.github.com" >> ~/.npmrc

# Authenticate (only needed for private packages)
npm login --registry=https://npm.pkg.github.com --scope=@lazboy
```

After that, `npx @lazboy/skills` works like any other npx command.

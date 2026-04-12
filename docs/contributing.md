# Contributing a Skill

Anyone at La-Z-Boy can contribute a skill. This guide walks you through the process.

---

## Before You Start

Read the org standard: [`skills/lazboy-skill-standard/SKILL.md`](../skills/lazboy-skill-standard/SKILL.md)

Every skill must follow the standard before it can be merged. The standard covers:
- Required folder structure
- How to write the SKILL.md and frontmatter
- When to use `scripts/`, `references/`, and `assets/`
- The quality checklist you must pass

---

## Step-by-Step

### 1. Clone the repo
```bash
git clone https://github.com/LZBRetail/lazboy-agent-skills.git
cd lazboy-agent-skills
```

### 2. Create your skill from the template
```bash
cp -r skills/lazboy-skill-standard/assets/skill-template skills/your-skill-name
```

### 3. Build your skill
Edit `skills/your-skill-name/SKILL.md` — fill in every `[placeholder]`.
Add content to `references/`, `scripts/`, `assets/` as needed.
Delete any folders you don't use (don't commit empty folders).

### 4. Run the quality checklist
Open `skills/lazboy-skill-standard/SKILL.md` and go through Section 6 (Quality Checklist).
Every item must be checked before you submit.

### 5. Test your skill
Install it locally and try at least 2–3 realistic prompts:
```bash
./install.sh your-skill-name --project /path/to/a/test-project
```
Open Claude Code in that project and verify the skill triggers correctly.

### 6. Register your skill
Add a row to the registry:
[`skills/lazboy-skill-standard/references/skill-registry.md`](../skills/lazboy-skill-standard/references/skill-registry.md)

### 7. Submit a Pull Request
- Branch name: `skill/your-skill-name`
- PR title: `Add skill: your-skill-name`
- Fill out the PR template

---

## PR Review Criteria

Your PR will be reviewed for:
- [ ] Follows org standard structure (all 4 folder types used correctly)
- [ ] SKILL.md frontmatter has strong trigger description (75–150 words)
- [ ] Quality checklist passed
- [ ] Skill registered in `skill-registry.md`
- [ ] No empty folders committed
- [ ] Scripts are runnable standalone
- [ ] Reference files over 300 lines have a table of contents

---

## Skill Ownership

Each skill needs an owner who:
- Keeps it up to date when the underlying source changes (brand guidelines, APIs, etc.)
- Reviews PRs that modify their skill
- Marks it `⚠️ Needs Update` in the registry if it becomes stale

Add yourself as owner in `skill-registry.md` when you submit.

---

## Questions?

Slack: `#ai-agent-skills`

#!/usr/bin/env node
// =============================================================================
// @lazboy/skills — La-Z-Boy Agent Skills CLI
// =============================================================================
// Usage:
//   npx @lazboy/skills list
//   npx @lazboy/skills add lazboy-brand
//   npx @lazboy/skills add lazboy-brand --global
//   npx @lazboy/skills add lazboy-brand --cursor
//   npx @lazboy/skills update lazboy-brand
//   npx @lazboy/skills remove lazboy-brand
// =============================================================================

const https  = require('https');
const fs     = require('fs');
const path   = require('path');
const os     = require('os');

// ── Config ────────────────────────────────────────────────────────────────────
const GITHUB_ORG    = 'lzbtemp';
const GITHUB_REPO   = 'lazboy-agent-skills';
const GITHUB_BRANCH = 'main';
const SKILLS_PATH   = 'skills'; // folder inside the repo where skills live

// GitHub raw base URL
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_ORG}/${GITHUB_REPO}/${GITHUB_BRANCH}`;
// GitHub API base URL
const API_BASE = `https://api.github.com/repos/${GITHUB_ORG}/${GITHUB_REPO}`;

// ── Colors ────────────────────────────────────────────────────────────────────
const c = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  blue:   '\x1b[34m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  red:    '\x1b[31m',
  dim:    '\x1b[2m',
  cyan:   '\x1b[36m',
};

const log = {
  info:    (msg) => console.log(`${c.blue}ℹ${c.reset}  ${msg}`),
  success: (msg) => console.log(`${c.green}✅${c.reset} ${msg}`),
  warn:    (msg) => console.log(`${c.yellow}⚠️ ${c.reset}  ${msg}`),
  error:   (msg) => console.error(`${c.red}❌${c.reset} ${msg}`),
  step:    (msg) => console.log(`${c.dim}   ${msg}${c.reset}`),
  title:   (msg) => console.log(`\n${c.bold}${c.blue}${msg}${c.reset}`),
};

// ── HTTP helper ───────────────────────────────────────────────────────────────
function get(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': '@lazboy/skills-cli',
        'Accept': 'application/vnd.github.v3+json',
      }
    };
    // Support GitHub token for private repos
    if (process.env.GITHUB_TOKEN) {
      options.headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    https.get(url, options, (res) => {
      // Follow redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        return get(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode === 404) {
        return reject(new Error(`Not found: ${url}`));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}: ${url}`));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

// ── GitHub API helpers ────────────────────────────────────────────────────────

// List all skills (folder names under /skills in the repo)
async function fetchSkillList() {
  const url = `${API_BASE}/contents/${SKILLS_PATH}?ref=${GITHUB_BRANCH}`;
  const data = JSON.parse(await get(url));
  return data
    .filter(item => item.type === 'dir')
    .map(item => item.name);
}

// Get all files in a skill folder (recursively)
async function fetchSkillFiles(skillName) {
  const url = `${API_BASE}/git/trees/${GITHUB_BRANCH}?recursive=1`;
  const data = JSON.parse(await get(url));
  const prefix = `${SKILLS_PATH}/${skillName}/`;
  return data.tree
    .filter(item => item.type === 'blob' && item.path.startsWith(prefix))
    .map(item => item.path);
}

// Download a single file from the repo
async function downloadFile(repoPath, destPath) {
  const url = `${RAW_BASE}/${repoPath}`;
  const content = await get(url);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, content, 'utf8');
}

// Get skill metadata from SKILL.md frontmatter
async function fetchSkillMeta(skillName) {
  try {
    const url = `${RAW_BASE}/${SKILLS_PATH}/${skillName}/SKILL.md`;
    const content = await get(url);
    const version = (content.match(/^version:\s*(.+)$/m) || [])[1]?.trim() || '1.0';
    const descMatch = content.match(/^description:\s*[>|]?\s*\n([\s\S]*?)(?=\n\w|\n---)/m);
    const desc = descMatch
      ? descMatch[1].replace(/\s+/g, ' ').trim().slice(0, 100) + '...'
      : 'No description available';
    return { version, desc };
  } catch {
    return { version: '1.0', desc: '' };
  }
}

// ── Install paths ─────────────────────────────────────────────────────────────
function getClaudePath(scope, projectPath) {
  if (scope === 'global') {
    return path.join(os.homedir(), '.claude', 'skills');
  }
  return path.join(projectPath || process.cwd(), '.claude', 'skills');
}

function getCursorPath(projectPath) {
  return path.join(projectPath || process.cwd(), '.cursor', 'rules');
}

// Convert SKILL.md to Cursor .mdc format
function buildMdcContent(skillMd, skillName) {
  // Strip frontmatter and rebuild as .mdc
  const withoutFrontmatter = skillMd.replace(/^---[\s\S]*?---\n/, '');
  const descMatch = skillMd.match(/^description:\s*[>|]?\s*\n([\s\S]*?)(?=\n\w|\n---)/m);
  const desc = descMatch
    ? descMatch[1].replace(/\s+/g, ' ').trim()
    : `La-Z-Boy ${skillName} skill`;

  return `---
description: ${desc}
globs: ["**/*.tsx", "**/*.jsx", "**/*.html", "**/*.css", "**/*.scss", "**/*.ts", "**/*.js"]
alwaysApply: false
---

${withoutFrontmatter}`;
}

// ── Commands ──────────────────────────────────────────────────────────────────

// LIST — show all available skills
async function cmdList() {
  log.title('La-Z-Boy Agent Skills');
  console.log(`${c.dim}  Available skills in ${GITHUB_ORG}/${GITHUB_REPO}${c.reset}\n`);

  let skills;
  try {
    skills = await fetchSkillList();
  } catch (e) {
    log.error(`Could not reach GitHub. Check your connection or set GITHUB_TOKEN for private repos.\n  ${e.message}`);
    process.exit(1);
  }

  for (const skill of skills) {
    const { version, desc } = await fetchSkillMeta(skill);
    console.log(`  ${c.bold}${c.cyan}${skill}${c.reset} ${c.dim}v${version}${c.reset}`);
    console.log(`  ${c.dim}${desc}${c.reset}\n`);
  }

  console.log(`${c.dim}  Install a skill:${c.reset} npx @lazboy/skills add <skill-name>`);
  console.log(`${c.dim}  Get help:${c.reset}       npx @lazboy/skills help\n`);
}

// ADD — download and install a skill
async function cmdAdd(skillName, flags) {
  if (!skillName) {
    log.error('Please specify a skill name. Run: npx @lazboy/skills list');
    process.exit(1);
  }

  const isGlobal  = flags.includes('--global');
  const isCursor  = flags.includes('--cursor');
  const isBoth    = flags.includes('--both');
  const projectPath = flags.includes('--project')
    ? flags[flags.indexOf('--project') + 1]
    : null;

  log.title(`Installing skill: ${skillName}`);

  // Fetch file list
  log.info('Fetching skill files from GitHub...');
  let files;
  try {
    files = await fetchSkillFiles(skillName);
  } catch (e) {
    if (e.message.includes('Not found')) {
      log.error(`Skill "${skillName}" not found. Run: npx @lazboy/skills list`);
    } else {
      log.error(`GitHub error: ${e.message}\n  Tip: set GITHUB_TOKEN env var if this is a private repo.`);
    }
    process.exit(1);
  }

  if (files.length === 0) {
    log.error(`Skill "${skillName}" has no files. It may not exist.`);
    process.exit(1);
  }

  // Install for Claude Code
  if (!isCursor || isBoth || !isCursor) {
    const skillsBase = getClaudePath(isGlobal ? 'global' : 'project', projectPath);
    const destBase   = path.join(skillsBase, skillName);

    log.info(`Downloading ${files.length} files...`);
    for (const filePath of files) {
      const relativePath = filePath.replace(`${SKILLS_PATH}/${skillName}/`, '');
      const destPath = path.join(destBase, relativePath);
      log.step(`${relativePath}`);
      await downloadFile(filePath, destPath);
    }
    log.success(`Claude Code: "${skillName}" installed → ${destBase}`);

    if (!isGlobal) {
      log.info(`Tip: commit ${c.cyan}.claude/skills/${c.reset} so your whole team gets this skill automatically.`);
    }
  }

  // Install for Cursor
  if (isCursor || isBoth) {
    const cursorBase = getCursorPath(projectPath);
    const mdcPath    = path.join(cursorBase, `${skillName}.mdc`);

    // Read the SKILL.md we already downloaded (or fetch it)
    const skillMdPath = path.join(
      getClaudePath('project', projectPath), skillName, 'SKILL.md'
    );
    let skillMd = '';
    if (fs.existsSync(skillMdPath)) {
      skillMd = fs.readFileSync(skillMdPath, 'utf8');
    } else {
      skillMd = await get(`${RAW_BASE}/${SKILLS_PATH}/${skillName}/SKILL.md`);
    }

    fs.mkdirSync(cursorBase, { recursive: true });
    fs.writeFileSync(mdcPath, buildMdcContent(skillMd, skillName), 'utf8');
    log.success(`Cursor: "${skillName}" installed → ${mdcPath}`);
    log.info(`Tip: commit ${c.cyan}.cursor/rules/${c.reset} so your whole team gets this rule automatically.`);
  }

  console.log(`\n${c.dim}  Restart Claude Code / Cursor to activate the skill.${c.reset}\n`);
}

// UPDATE — re-download latest version of a skill
async function cmdUpdate(skillName, flags) {
  if (!skillName) {
    log.error('Please specify a skill name.');
    process.exit(1);
  }
  log.title(`Updating skill: ${skillName}`);
  log.info('Removing existing skill files...');

  const isGlobal    = flags.includes('--global');
  const projectPath = flags.includes('--project')
    ? flags[flags.indexOf('--project') + 1]
    : null;
  const skillsBase  = getClaudePath(isGlobal ? 'global' : 'project', projectPath);
  const destBase    = path.join(skillsBase, skillName);

  if (fs.existsSync(destBase)) {
    fs.rmSync(destBase, { recursive: true, force: true });
  }

  await cmdAdd(skillName, flags);
}

// REMOVE — delete a skill from the project
async function cmdRemove(skillName, flags) {
  if (!skillName) {
    log.error('Please specify a skill name.');
    process.exit(1);
  }

  const isGlobal    = flags.includes('--global');
  const projectPath = flags.includes('--project')
    ? flags[flags.indexOf('--project') + 1]
    : null;
  const skillsBase  = getClaudePath(isGlobal ? 'global' : 'project', projectPath);
  const destBase    = path.join(skillsBase, skillName);

  if (!fs.existsSync(destBase)) {
    log.warn(`Skill "${skillName}" is not installed at ${destBase}`);
    process.exit(0);
  }

  fs.rmSync(destBase, { recursive: true, force: true });
  log.success(`Removed "${skillName}" from ${destBase}`);

  // Also remove Cursor rule if it exists
  const cursorPath = path.join(getCursorPath(projectPath), `${skillName}.mdc`);
  if (fs.existsSync(cursorPath)) {
    fs.unlinkSync(cursorPath);
    log.success(`Removed Cursor rule: ${cursorPath}`);
  }
}

// HELP
function cmdHelp() {
  console.log(`
${c.bold}${c.blue}@lazboy/skills${c.reset} — La-Z-Boy Agent Skills CLI

${c.bold}Usage:${c.reset}
  npx @lazboy/skills <command> [skill-name] [options]

${c.bold}Commands:${c.reset}
  ${c.cyan}list${c.reset}                         List all available skills
  ${c.cyan}add${c.reset}    <skill-name>           Install a skill into current project
  ${c.cyan}update${c.reset} <skill-name>           Update a skill to the latest version
  ${c.cyan}remove${c.reset} <skill-name>           Remove a skill from current project
  ${c.cyan}help${c.reset}                         Show this help

${c.bold}Options:${c.reset}
  ${c.yellow}--global${c.reset}                     Install globally (all projects on this machine)
  ${c.yellow}--cursor${c.reset}                     Also install as a Cursor rule (.mdc)
  ${c.yellow}--both${c.reset}                       Install for both Claude Code and Cursor
  ${c.yellow}--project${c.reset} <path>             Target a specific project path

${c.bold}Examples:${c.reset}
  npx @lazboy/skills list
  npx @lazboy/skills add lazboy-brand
  npx @lazboy/skills add lazboy-brand --global
  npx @lazboy/skills add lazboy-brand --cursor
  npx @lazboy/skills add lazboy-brand --project ~/projects/my-app
  npx @lazboy/skills update lazboy-brand
  npx @lazboy/skills remove lazboy-brand

${c.bold}Private repo?${c.reset}
  Set a GitHub token so the CLI can access the repo:
  ${c.dim}export GITHUB_TOKEN=your_token_here${c.reset}

${c.bold}Questions?${c.reset}
  Slack: #ai-agent-skills
  GitHub: https://github.com/${GITHUB_ORG}/${GITHUB_REPO}
`);
}

// ── Main entry point ──────────────────────────────────────────────────────────
async function main() {
  const args     = process.argv.slice(2);
  const command  = args[0];
  const skillName = args[1] && !args[1].startsWith('--') ? args[1] : null;
  const flags    = args.filter(a => a.startsWith('--') || (args.indexOf(a) > 1));

  switch (command) {
    case 'list':
      await cmdList();
      break;
    case 'add':
      await cmdAdd(skillName, flags);
      break;
    case 'update':
      await cmdUpdate(skillName, flags);
      break;
    case 'remove':
    case 'uninstall':
      await cmdRemove(skillName, flags);
      break;
    case 'help':
    case '--help':
    case '-h':
      cmdHelp();
      break;
    default:
      if (!command) {
        cmdHelp();
      } else {
        log.error(`Unknown command: "${command}"`);
        console.log(`  Run ${c.cyan}npx @lazboy/skills help${c.reset} to see available commands.\n`);
        process.exit(1);
      }
  }
}

main().catch(err => {
  log.error(err.message);
  process.exit(1);
});

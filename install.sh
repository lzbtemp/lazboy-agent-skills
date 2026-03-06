#!/usr/bin/env bash
# =============================================================================
# La-Z-Boy Agent Skills Installer
# =============================================================================
# Usage:
#   ./install.sh <skill-name> [options]
#   ./install.sh --all [options]
#
# Options:
#   --global              Install globally (~/.claude/skills/) [default for Claude Code]
#   --project <path>      Install into a specific project directory
#   --cursor              Also generate a Cursor .mdc rule file
#   --tool <claude|cursor|both>  Target tool (default: claude)
#   --list                List all available skills
#   --help                Show this help
#
# Examples:
#   ./install.sh lazboy-brand --global
#   ./install.sh lazboy-brand --project ~/projects/my-lazboy-app
#   ./install.sh lazboy-brand --project ~/projects/my-lazboy-app --cursor
#   ./install.sh --all --global
# =============================================================================

set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_DIR="$REPO_DIR/skills"

# ── Colors for output ─────────────────────────────────────────────────────────
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
RESET='\033[0m'

info()    { echo -e "${BLUE}ℹ${RESET}  $1"; }
success() { echo -e "${GREEN}✅${RESET} $1"; }
warn()    { echo -e "${YELLOW}⚠️ ${RESET} $1"; }
error()   { echo -e "${RED}❌${RESET} $1"; exit 1; }

# ── Helpers ───────────────────────────────────────────────────────────────────
list_skills() {
  echo ""
  echo "Available skills:"
  echo "-----------------"
  for dir in "$SKILLS_DIR"/*/; do
    skill_name=$(basename "$dir")
    # Extract description from SKILL.md frontmatter
    desc=$(grep -A3 '^description:' "$dir/SKILL.md" 2>/dev/null | \
           grep -v '^description:' | grep -v '^---' | head -1 | sed 's/^[[:space:]]*//' | cut -c1-60)
    version=$(grep '^version:' "$dir/SKILL.md" 2>/dev/null | awk '{print $2}' | tr -d '"')
    version=${version:-"1.0"}
    printf "  %-30s v%-5s %s\n" "$skill_name" "$version" "$desc..."
  done
  echo ""
}

install_for_claude() {
  local skill_name=$1
  local scope=$2      # "global" or "project"
  local project_path=$3

  local skill_src="$SKILLS_DIR/$skill_name"
  [ -d "$skill_src" ] || error "Skill '$skill_name' not found. Run ./install.sh --list to see available skills."

  if [ "$scope" = "global" ]; then
    local dest="$HOME/.claude/skills/$skill_name"
  else
    [ -n "$project_path" ] || error "--project path required for project-scoped install"
    local dest="$project_path/.claude/skills/$skill_name"
  fi

  mkdir -p "$dest"
  cp -r "$skill_src"/. "$dest/"
  success "Claude Code: '$skill_name' installed → $dest"

  if [ "$scope" = "project" ]; then
    info "Tip: commit .claude/skills/ to your repo so your whole team gets this skill automatically."
  fi
}

install_for_cursor() {
  local skill_name=$1
  local project_path=$2

  [ -n "$project_path" ] || error "Cursor install requires --project <path>"

  local skill_src="$SKILLS_DIR/$skill_name"
  [ -d "$skill_src" ] || error "Skill '$skill_name' not found."

  local cursor_dir="$project_path/.cursor/rules"
  mkdir -p "$cursor_dir"

  local mdc_file="$cursor_dir/$skill_name.mdc"

  # Build .mdc file from SKILL.md
  # Extract description for the globs/trigger
  local desc
  desc=$(grep -A5 '^description:' "$skill_src/SKILL.md" | grep -v '^description:' | grep -v '^---' | \
         sed 's/^[[:space:]]*//' | tr '\n' ' ' | cut -c1-200)

  cat > "$mdc_file" << EOF
---
description: ${desc}
globs: ["**/*.tsx", "**/*.jsx", "**/*.html", "**/*.css", "**/*.scss", "**/*.ts", "**/*.js"]
alwaysApply: false
---

$(cat "$skill_src/SKILL.md" | grep -v '^---' | grep -v '^name:' | grep -v '^version:' | grep -v '^description:')
EOF

  success "Cursor: '$skill_name' installed → $mdc_file"
  info "Tip: commit .cursor/rules/ to your repo so your whole team gets this rule automatically."
}

# ── Argument parsing ───────────────────────────────────────────────────────────
SKILL_NAME=""
INSTALL_ALL=false
SCOPE="global"
PROJECT_PATH=""
TOOL="claude"
DO_CURSOR=false

if [ $# -eq 0 ]; then
  echo "Usage: ./install.sh <skill-name> [options]"
  echo "       ./install.sh --list"
  echo "       ./install.sh --help"
  exit 0
fi

while [[ $# -gt 0 ]]; do
  case "$1" in
    --list)       list_skills; exit 0 ;;
    --help|-h)    head -25 "$0" | grep "^#" | sed 's/^# \?//'; exit 0 ;;
    --all)        INSTALL_ALL=true ;;
    --global)     SCOPE="global" ;;
    --project)    SCOPE="project"; PROJECT_PATH="$2"; shift ;;
    --cursor)     DO_CURSOR=true ;;
    --tool)       TOOL="$2"; shift ;;
    -*)           error "Unknown option: $1" ;;
    *)            SKILL_NAME="$1" ;;
  esac
  shift
done

# ── Main logic ─────────────────────────────────────────────────────────────────
echo ""
echo "La-Z-Boy Agent Skills Installer"
echo "================================"

if $INSTALL_ALL; then
  for dir in "$SKILLS_DIR"/*/; do
    name=$(basename "$dir")
    install_for_claude "$name" "$SCOPE" "$PROJECT_PATH"
    if $DO_CURSOR; then
      install_for_cursor "$name" "$PROJECT_PATH"
    fi
  done
  success "All skills installed!"
else
  [ -n "$SKILL_NAME" ] || error "Skill name required. Run ./install.sh --list to see options."
  install_for_claude "$SKILL_NAME" "$SCOPE" "$PROJECT_PATH"
  if $DO_CURSOR; then
    install_for_cursor "$SKILL_NAME" "$PROJECT_PATH"
  fi
fi

echo ""
info "Restart Claude Code / Cursor to activate newly installed skills."
echo ""

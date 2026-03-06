# formating_py_files

Reformat a Python file exported from a Jupyter notebook into a clean, production-ready script.

---

## Installation

### Option 1 — Copy the folder manually

Place the `formating_py_files/` folder inside your Claude skills directory:

**Windows**
```
C:\Users\<your-username>\.claude\skills\formating_py_files\
```

**macOS / Linux**
```
~/.claude/skills/formating_py_files/
```

The folder must contain at minimum `SKILL.md`. Claude Code auto-discovers skills from that directory.

---

### Option 2 — Clone from a repo

If the skill lives inside a repository, you have two options after cloning:

**a) Copy** the folder into your skills directory:
```bash
# Windows (Git Bash)
cp -r path/to/repo/formating_py_files ~/.claude/skills/

# macOS / Linux
cp -r path/to/repo/formating_py_files ~/.claude/skills/
```

**b) Symlink** (keeps it in sync with the repo automatically):
```bash
# macOS / Linux
ln -s "$(pwd)/formating_py_files" ~/.claude/skills/formating_py_files

# Windows (Git Bash — run as Administrator)
cmd //c mklink /D "%USERPROFILE%\\.claude\\skills\\formating_py_files" "$(pwd -W)\\formating_py_files"
```

---

## Verify the skill is loaded

Open any Claude Code session and run:
```
/formating_py_files
```
Or check that it appears in the skills list at the start of a conversation.

---

## Triggers

Use this skill when the user says things like:

- "clean up / reformat this Python file"
- "remove the `# %%` markers"
- "remove exploration code / unused imports"
- "restructure this script"
- "format this .py converted from a notebook"

## Usage

```
/formating_py_files your_file.py
```

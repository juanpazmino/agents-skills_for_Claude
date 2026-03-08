---
name: formatting_py_files
description: |
  Reformat a Python file into a clean, production-ready script.
  Removes # %% Jupyter cell markers, bare display expressions, unused imports,
  and commented-out dead code. Restructures into standard sections and saves as a new file.

  Use when: cleaning up a .py exported from a notebook, removing # %% markers,
  standardizing import order, removing exploration code, or restructuring a messy script.
---

## Steps

1. **Read the target file in full** before making any changes.

2. **Ask before starting** if any of these are unclear:
   - Are there imports or functions that look unused but must be kept?
   - Is any commented-out code pending implementation (keep it)?
   - What should the output filename be?

3. **Remove Jupyter notebook artifacts**
   - All `# %%` and `# %% [markdown]` cell markers.
   - Bare display expressions used only for notebook output:
     `df.head()`, `df.shape`, `df.columns`, `df.dtypes`, `df.info()`,
     `df["col"].value_counts()`, `df.duplicated().sum()`,
     and any standalone variable on its own line used only to print its value.

4. **Remove dead code**
   - Commented-out code blocks (lines starting with `#` that contain executable code).
   - Keep TODO / NOTE comments that flag pending work.
   - Unused imports — imports never referenced in the file.
   - Variables or functions defined but never used.

5. **Restructure into standard sections** in this order:
   ```
   # Standard library imports
   # Third-party imports
   # Local imports
   # Constants
   # Functions / classes
   # Execution
   ```
   Separate each section with a visible header:
   ```python
   # =============================================================================
   # Section Name
   # =============================================================================
   ```

6. **Import ordering** within each group (standard / third-party / local):
   - Alphabetical order.
   - `import X` before `from X import Y`.

7. **Add short comments** only where logic is not self-evident.
   - One-line docstrings on functions are sufficient.
   - Do not comment obvious lines.

8. **Save as a new file** — never overwrite the original.
   - Default: append `_clean` before the extension → `script.py` → `script_clean.py`.
   - Confirm the output filename with the user if ambiguous.

## What NOT to change

- Do not refactor working logic — only restructure and clean.
- Do not add type annotations, docstrings, or error handling beyond what exists.
- Keep all string literals (prompts, regex patterns, dicts) verbatim.
- Keep TODO / NOTE comments that mark pending work.

<!--
Thanks for contributing! Make sure your PR follows the conventions in AGENTS.md / CONTRIBUTING.md.
-->

## What this PR does

<!-- One or two sentences. -->

## Type of change

- [ ] New snippet
- [ ] New variant of existing snippet
- [ ] Bug fix
- [ ] Documentation update (INDEX.md, AGENTS.md, README, etc.)
- [ ] Demo update
- [ ] Other:

## Files added / changed

<!-- List them. -->

## Snippet details (if adding a new snippet)

- **Folder:** <!-- e.g. effects/, components/ -->
- **JS global (if any):** <!-- e.g. `MyModule` -->
- **CSS prefix:** <!-- e.g. `.mymod-` -->
- **Inspired by:** <!-- optional — source URL -->

## Checklist

- [ ] Header comment with `Usage / Variants / Modifiers` documentation
- [ ] JS uses the IIFE+UMD wrapper (`(function (root) {...})(typeof window !== 'undefined' ? window : this)`)
- [ ] CSS uses `--vars` for every tunable value
- [ ] Zero new dependencies (or only Three.js via CDN if `3d/*`)
- [ ] `INDEX.md` has a tagged 2-line entry with synonym-rich tags
- [ ] `demo/index.html` has a live preview section
- [ ] Tested in Chrome + Firefox at minimum
- [ ] Respects `prefers-reduced-motion` if animated
- [ ] No global pollution outside one explicit export

## Screenshot / GIF

<!-- Highly recommended for visual snippets. -->

## Related issues

<!-- Closes #123 -->

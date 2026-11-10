1. **Define Stack Picker Constants**: Add a new constant `STACK_CATEGORIES` near the top of `src/SpecForgeStudio.tsx` that defines the categorizes and pills:
   - Frontend: `React 19`, `Next.js 15`, `Vue 3.5`, `Svelte 5`, `Tailwind CSS v4`
   - Backend / DB: `Supabase`, `Firebase`, `Postgres + Drizzle`, `Prisma`, `SQLite`
   - Testing: `Vitest`, `Playwright`, `Jest`
2. **Implement Interactive Pill Toggle**:
   - In `src/SpecForgeStudio.tsx`, create a helper function `toggleStackPill(stack)` that adds the string to `form.pinnedStack` if it's not present, and removes it if it is, while keeping custom text intact. Ensure comma separation is maintained properly.
3. **Update UI**:
   - In `src/SpecForgeStudio.tsx`, locate the "Pinned Stack & Exact SDK Versions" section (around line 3734).
   - Replace or append to the existing `QUICK_FILL_CHIPS` with the new categorized pill groups.
   - For each category, render a label and the group of pills.
   - Ensure the active state of each pill is determined by checking if the pill's string is present in `form.pinnedStack`. Apply the active styling (cyan/indigo) to active pills.
4. **Update Tests**:
   - In `src/__tests__/SpecForgeStudio.test.tsx`, add a test case to verify that clicking a stack pill toggles the string in the textarea and updates the `TASK_PROMPT.md` output.
5. **Run Verifications**:
   - Run `npm run typecheck` and `npm test` to ensure there are no regressions.
6. **Pre-commit Checks**: Run pre-commit instructions.

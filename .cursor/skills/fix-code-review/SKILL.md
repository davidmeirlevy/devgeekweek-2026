---
name: fix-code-review
description: Read unresolved inline review comments on the current branch PR via gh CLI, fix each one, then commit, push, and resolve the thread before moving to the next. Use when the user asks to fix code review comments, address PR feedback, resolve review threads, or fix review comments on an open pull request.
---

# Fix Code Review

Address inline PR review comments one at a time: fix → test → commit → push → resolve thread.

## Required inputs

| Input | Default |
|-------|---------|
| **PR** | Active PR for current branch (`gh pr view`) |
| **Repo** | Current git remote (`gh` resolves `{owner}/{repo}`) |

Ask only if the current branch has no open PR.

## Workflow

Copy and track progress:

```
- [ ] Step 1: Fetch unresolved review comments
- [ ] Step 2: Triage and order comments
- [ ] Step 3: Fix loop (one comment per iteration)
- [ ] Step 4: Final verification
```

### Step 1 — Fetch unresolved review comments

Resolve the PR number:

```bash
gh pr view --json number,url,headRefName
```

Fetch review threads (GraphQL — needed for `threadId` to resolve later):

```bash
gh api graphql -f query='
query($owner: String!, $repo: String!, $pr: Int!) {
  repository(owner: $owner, name: $repo) {
    pullRequest(number: $pr) {
      reviewThreads(first: 100) {
        nodes {
          id
          isResolved
          isOutdated
          path
          line
          comments(first: 20) {
            nodes {
              id
              databaseId
              body
              author { login }
            }
          }
        }
      }
    }
  }
}' -f owner=OWNER -f repo=REPO -F pr=PR_NUMBER
```

Derive `OWNER`/`REPO` from `gh repo view --json nameWithOwner -q .nameWithOwner`.

**Only process threads where `isResolved` is `false`.** Skip resolved threads.

If `isOutdated` is `true`, re-read the file at the referenced path — the line may have shifted. Fix the underlying feedback, not the stale line number.

REST fallback for comment bodies only (no thread IDs):

```bash
gh api repos/{owner}/{repo}/pulls/PR_NUMBER/comments
```

### Step 2 — Triage and order comments

Build an ordered action list. Default order:

1. Correctness / type-safety / validation bugs
2. Architecture / layering / convention mismatches
3. Nits and style

If a comment is ambiguous or needs a product decision, **stop and ask** — do not guess.

### Step 3 — Fix loop (one comment per iteration)

For **each** unresolved thread, in order:

#### 3a. Fix

- Read the thread's first comment (`comments.nodes[0].body`) and any replies.
- Implement the smallest correct change that addresses the feedback.
- Match existing project conventions (layering, tests, error format).

#### 3b. Test

```bash
npm test
```

**Stop the loop if tests fail.** Fix failures before committing. Do not resolve the thread until tests pass.

#### 3c. Commit

Run in parallel:

```bash
git status
git diff
git log -5 --oneline
```

Stage only files for this fix. Commit message format:

```
fix: address review on {path}

{one-line summary of what changed}
```

Use a HEREDOC for the commit message. Do not batch multiple review fixes into one commit.

#### 3d. Push

```bash
git push
```

Use `git push -u origin HEAD` only if the branch has no upstream.

#### 3e. Resolve the thread

```bash
gh api graphql -f query='
mutation($threadId: ID!) {
  resolveReviewThread(input: { threadId: $threadId }) {
    thread { id isResolved }
  }
}' -f threadId=THREAD_ID
```

Use the thread's `id` from step 1 (e.g. `PRRT_kwDO...`), not a comment `databaseId`.

Confirm `isResolved` is `true` in the response before moving to the next comment.

#### 3f. Mark progress

Update the checklist. Proceed to the next unresolved thread.

### Step 4 — Final verification

After all threads are resolved:

```bash
npm test
gh pr view --json url,reviewDecision
```

Report:

- PR URL
- Count of comments fixed and threads resolved
- Anything skipped (with reason)

## Constraints

- **One comment → one commit → one push → one resolve.** Never batch.
- **Tests gate each iteration** — no commit/push/resolve while tests are red.
- **Never** update git config, skip hooks, or force-push unless the user explicitly requests it.
- **Never** resolve a thread without pushing the fix first.
- Inline review threads only — general PR discussion comments (`gh pr view --comments`) are out of scope unless the user asks.
- This skill implies permission to commit and push review fixes.

## gh reference

| Command | Purpose |
|---------|---------|
| `gh pr view --json number,url` | Resolve active PR |
| `gh repo view --json nameWithOwner` | Resolve owner/repo |
| GraphQL `reviewThreads` | List threads with `threadId` |
| GraphQL `resolveReviewThread` | Mark thread resolved |
| `gh api repos/{owner}/{repo}/pulls/N/comments` | REST fallback for comment details |

# Reyansh 10th Birthday Quiz

A dependency-free static web app for a "How well do you know Reyansh?" birthday quiz.

## What It Does

- Runs as a static app, so it can be deployed directly on Vercel.
- Starts with 20 parent-fill personal-preference question slots.
- Lets an owner or parent enter the correct answer and four choices for each question.
- Lets an owner add custom questions and delete starter/custom questions.
- Admin login is checked server-side with the `ADMIN_ID` environment variable.
- Saves shared setup, participants, and results to Vercel Blob when deployed.
- Shows a fresh leaderboard for each India-date, with older results grouped under previous dates.
- Exports/imports setup JSON.
- Generates shareable player and owner links with the current quiz setup.
- Creates result tickets so kids can play on separate devices and the host can paste their results into the leaderboard.

## Local Preview

From this folder:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173
```

## Vercel Deployment

Create a GitHub repo, for example `reyansh-10th-birthday`, put this folder's contents at the repo root, and deploy it on Vercel as a static project.

If you keep it inside the current workspace repo, set the Vercel project root to:

```text
reyansh-10th-birthday
```

## Admin Flow

- Open the Owner tab.
- Enter the admin ID shared separately with the host/parents.
- Fill or edit correct answers. The answer is backfilled into the selected multiple-choice slot, with three plausible distractors already present.
- Use the Add/Delete tab to add extra questions or remove starter/custom questions.
- Keep the Owner tab open during the party to see in-progress participants and submitted scores. It refreshes every five seconds.
- Use the Results tab to clear today's board, clear all dates, or remove individual leaderboard entries.

## Important Note

This is a family-party app, not a high-security exam system. The admin ID gates the editing UI and API, and the value should be set as `ADMIN_ID` in Vercel instead of being written into the public app.

Shared scoring uses Vercel Blob through `BLOB_READ_WRITE_TOKEN`. The Vercel CLI-created Blob store is connected to the project and the token is stored in Vercel/project env, not in git.

## Image Asset

The banner image was generated with the built-in `imagegen` tool and saved at:

```text
assets/birthday-quiz-banner.png
```

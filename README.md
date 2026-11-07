# Chemistry Atlas — Complete IB Chemistry 2025

A responsive, independent learning website for the **entire uploaded IB Chemistry syllabus (first assessment 2025)**. It is organized around understanding a concept, viewing a scientific model, following a worked example and practising questions.

## What is included

- **22 topics and all 165 numbered outcomes:** 104 shared SL outcomes and 61 additional HL outcomes, checked against the uploaded guide.
- **165 original explanations and worked examples**, plus exam-method steps and common mistakes. Every lesson has an original SVG concept illustration; specific topics include molecular structures, spectra, titration curves, Maxwell–Boltzmann distributions and electrochemical diagrams.
- **130 independent exam-style questions**, with a topic/level/paper/difficulty filter, worked marking guidance, bookmarks and written answer drafts. Shared questions are tagged SL + HL; extension questions are tagged HL.
- **Target tests:** choose topics, question style, difficulty, question count, time limit and target percentage. Test answers save locally, the timer continues across navigation, MCQs mark automatically and written responses are self-marked after submission. A score is provisional until written responses are marked.
- **220 direct creator video links and 33 topic collections** (MSJ Chem). Links and topic associations were verified from creator pages on 7 November 2026. Playback was not tested and videos may change. Where no exact outcome mapping was verified, the lesson uses a labelled related topic collection.
- **Separate SL and HL official-paper libraries:** the 2025 specimen bundle with paper/markscheme page links, five publicly released May 2025 paper samples and the official licensed IB Questionbank. This is not a complete archive of every exam session.
- **12 practical/data/inquiry/IA skill guides**, local progress, export/import backups, and optional cloud sync.
- **Real email-code login and an AI tutor integration** prepared for Supabase. These need the owner’s setup and provider credentials. They are not pretended to be live in the unconfigured site.

## Start now

Open `dist/index.html` with the other files alongside it, or use the separate `Chemistry_Atlas_Full_Course.html` single-file download for offline study. The single-file edition includes all lessons, diagrams, questions and test logic. Videos, official papers and cloud services require internet.

For local development, serve `dist/` with any static server. For example:

```sh
python -m http.server 8000 --directory dist
```

## Publish with GitHub

1. Upload this project's contents to a new repository. Include `.github/workflows/pages.yml`; upload the project contents, not a ZIP file and not an additional enclosing folder.
2. Set **Settings → Pages → Source → GitHub Actions**.
3. Push to `main` or run the included workflow. It rebuilds and checks the content, then publishes `dist/`.
4. Configure cloud features separately using **[DEPLOYMENT.md](DEPLOYMENT.md)**. Do not add private API keys to `dist/` or the repository.

The static study site works immediately after publishing. Actual email login, database sync and model calls only work after you complete the backend setup.

## Maintain the course

Editable original source is in `content/` and `scripts/skills.json`. Frontend is in `dist/`.

```sh
python scripts/build.py
node tests/course.test.cjs
node backend/auth.test.cjs
```

The build fails if any of the 165 source outcomes is missing, duplicated or assigned the wrong SL/HL status. `dist/coverage.json` maps outcome IDs to the uploaded guide's page numbers. When changing question data, preserve question order/IDs if existing saved records must continue matching.

## Scope and source transparency

The user's uploaded **Chemistry Syllabus 2025.pdf** determines the topic scope and SL/HL boundaries. It is a syllabus, not a textbook; the explanations, calculations and original images in this site are newly written teaching material aligned to that scope. The original uploaded PDF is not redistributed in the package.

The interface uses familiar revision-site patterns (syllabus navigation, lesson notes, worked examples and topic practice) with its own branding and implementation. It does not reproduce Save My Exams, Revision Village or RevisionDojo content or branding.

The built-in question bank and marking guidance are **original independent practice**, not officially authored IB questions or mark schemes. Licensed IB past-paper content is linked rather than republished. The site is not affiliated with or endorsed by the IB or those revision providers.

## Verification and limits

Coverage and SL/HL labels were checked programmatically against the uploaded syllabus. All 165 lesson renderings, every topic's practice/video availability, official level split, mixed test scoring and backup bounds pass pure rendering/data tests. Browser checks covered the desktop homepage, SL filtering, official resources, a full-course HL lesson, persistent lesson completion, and a timed MCQ test through to its result. The responsive CSS is included; small-screen rendering was not separately browser-tested in this environment.

The cloud client passed mocked OTP, session-refresh, progress and tutor tests. Live email delivery, database policies and model output could not be tested because no Supabase project or model credentials were supplied. Written test scores are self-awarded; AI is a text tutor, not a verified examiner or guaranteed answer key. The target percentage is the student's practice goal and does not imply an official grade boundary.

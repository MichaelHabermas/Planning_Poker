# TASK LIST

## ✅ Agile Planning Poker App: Comprehensive Development TASKLIST

This TASKLIST is structured according to the product's Epics and adheres to the specified development workflow, including a preparatory task (Task 0), and detailed breakdowns into PRs, Commits, and Sub-Tasks.

---

### 🔨 Task 0: Tooling, Prep, Linting & Architecture Setup (Foundation)

| Check | Task Description | Type | Epic/Module |
| :--- | :--- | :--- | :--- |
| $\square$ | **PR 0.1: Project Initialization & Tooling** | PR | Foundation |
| $\square$ | **Commit 0.1.1: `feat: initialize project with React/TS/Vite`** | Commit | Foundation |
| $\square$ | Initialize Vite/React/TypeScript project. | Sub-Task | Foundation |
| $\square$ | Install core dependencies (React, TS, Vite). | Sub-Task | Foundation |
| $\square$ | **Commit 0.1.2: `feat: configure Tailwind CSS v4 and shadcn/ui`** | Commit | Foundation |
| $\square$ | Install and configure Tailwind CSS v4. | Sub-Task | Foundation |
| $\square$ | Configure `shadcn/ui` using the default theme. | Sub-Task | Foundation |
| $\square$ | **Commit 0.1.3: `feat: establish linting and architectural structure`** | Commit | Foundation |
| $\square$ | Configure ESLint, Prettier, and TypeScript checks. | Sub-Task | Foundation |
| $\square$ | Define initial project structure (`/src/components`, `/src/services`, `/src/hooks`, `/src/types`). | Sub-Task | Foundation |
| $\square$ | Create the server-side, in-memory `SessionState` conceptual data model (as a mock/service layer). | Sub-Task | Foundation |
| $\square$ | Implement a basic client-side polling mechanism stub. | Sub-Task | Foundation |

---

### 1. 🌐 Epic 1: Session Management Module (FR-SM-100 to FR-SM-104)

**Goal:** Establish session creation, joining, and real-time user presence tracking.

| Check | Task Description | Requirement |
| :--- | :--- | :--- |
| $\square$ | **PR 1.1: Session Creation & Join Endpoints** | FR-SM-100, FR-SM-101, FR-SM-102 |
| $\square$ | **Commit 1.1.1: `feat(SM): implement session creation logic (FR-SM-100)`** | Commit |
| $\square$ | Create POST endpoint `/api/session/create`. | Sub-Task |
| $\square$ | Implement logic to create a unique `SessionID` (UUID/Short Code) and store the initial `SessionState` in memory. | Sub-Task |
| $\square$ | **Commit 1.1.2: `feat(SM): implement session join logic (FR-SM-101, FR-SM-102)`** | Commit |
| $\square$ | Create POST endpoint `/api/session/join`. | Sub-Task |
| $\square$ | Implement logic to validate `SessionID` and add the user to the `Users` map with a generated `UserID` and input `DisplayName`. | Sub-Task |
| $\square$ | **Commit 1.1.3: `feat(SM): create Session setup UI`** | Commit |
| $\square$ | Implement a simple UI for Session Creation (Facilitator view). | Sub-Task |
| $\square$ | Implement a simple UI for Session Joining (Join Code and Display Name input). | Sub-Task |
| $\square$ | **PR 1.2: Real-time State Polling & User List** | FR-SM-103, FR-SM-104 |
| $\square$ | **Commit 1.2.1: `feat(SM): implement session state polling endpoint (FR-SM-103)`** | Commit |
| $\square$ | Create GET endpoint `/api/session/{id}/state` to return the current `SessionState`. | Sub-Task |
| $\square$ | Implement client-side polling mechanism (2-3 second interval) to fetch state. | Sub-Task |
| $\square$ | **Commit 1.2.2: `feat(SM): display active user list (FR-SM-103)`** | Commit |
| $\square$ | Implement the **Active User List** component (`<ParticipantList>`) to display names and roles. | Sub-Task |
| $\square$ | **Commit 1.2.3: `feat(SM): implement user exit/timeout mechanism (FR-SM-104)`** | Commit |
| $\square$ | Implement server-side logic to remove a user from the `Users` map after 60 seconds of inactivity (no polling/action calls). | Sub-Task |
| $\square$ | **Commit 1.2.4: `test(SM): manual and unit tests for session lifecycle`** | Commit |
| $\square$ | **Manual Test:** Create a session, join as 2 Voters, verify real-time user list update via polling. | Sub-Task |
| $\square$ | **Manual Test:** Close one browser window, verify participant is removed after timeout. | Sub-Task |

---

### 2. 🛡️ Epic 2: User Roles & Permissions Module (FR-UR-200 to FR-UR-202)

**Goal:** Enforce the three distinct roles (Facilitator, Voter, Observer) and their associated permissions.

| Check | Task Description | Requirement |
| :--- | :--- | :--- |
| $\square$ | **PR 2.1: Role Assignment and Permission Checks** | FR-UR-200, FR-UR-201, FR-UR-202 |
| $\square$ | **Commit 2.1.1: `feat(UR): implement initial role assignment logic`** | Commit |
| $\square$ | Ensure `Session Creation` (Epic 1) correctly assigns `FACILITATOR` role to the creator. | Sub-Task |
| $\square$ | Implement logic in `Session Joining` (Epic 1) to assign `VOTER` role by default. | Sub-Task |
| $\square$ | Update `User Object` in state to include the `Role` enum. | Sub-Task |
| $\square$ | **Commit 2.1.2: `feat(UR): implement Facilitator-only permission checks (FR-UR-200, FR-UR-201)`** | Commit |
| $\square$ | Create a reusable server-side middleware/utility to validate role (`IsFacilitator` check) for state-changing endpoints. | Sub-Task |
| $\square$ | Apply the check to the `/story`, `/reveal`, `/reset`, and `/archive` endpoints (stubs for now). | Sub-Task |
| $\square$ | **Commit 2.1.3: `feat(UR): implement Voter-only permission check (FR-UR-202)`** | Commit |
| $\square$ | Apply the role check to the `/vote` endpoint (stub for now). | Sub-Task |
| $\square$ | **Commit 2.1.4: `feat(UR): implement Facilitator UI controls (role-based)`** | Commit |
| $\square$ | Implement UI logic to **show/hide** the Story Input, Reveal, Reset, and Archive buttons based on the user's role (`FACILITATOR`). | Sub-Task |
| $\square$ | Implement UI logic to **show/hide** the Card Selection Deck based on the user's role (`VOTER`). | Sub-Task |
| $\square$ | **Commit 2.1.5: `test(UR): manual tests for role enforcement`** | Commit |
| $\square$ | **Manual Test:** Verify a `VOTER` cannot see/interact with `Reveal Card` button. | Sub-Task |
| $\square$ | **Manual Test:** Verify a `FACILITATOR` can see/interact with `Reveal Card` button. | Sub-Task |

---

### 3. 🃏 Epic 3: Core Voting Mechanics Module (FR-CM-300 to FR-CM-305)

**Goal:** Implement the full voting cycle, including card selection, submission, reveal, and results calculation.

| Check | Task Description | Requirement |
| :--- | :--- | :--- |
| $\square$ | **PR 3.1: Card Deck and Vote Submission** | FR-CM-300, FR-CM-301, FR-CM-302 |
| $\square$ | **Commit 3.1.1: `feat(CM): define and display the Card Deck (FR-CM-300)`** | Commit |
| $\square$ | Define the Fibonacci card values (0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, $\infty$/Coffee). | Sub-Task |
| $\square$ | Create the `<CardDeck>` component, only visible to the `VOTER` role. | Sub-Task |
| $\square$ | **Commit 3.1.2: `feat(CM): implement vote submission endpoint (FR-CM-302)`** | Commit |
| $\square$ | Implement the POST endpoint `/api/session/{id}/vote` to update the `Votes` map in the state. | Sub-Task |
| $\square$ | Ensure the endpoint accepts unlimited changes until reveal. | Sub-Task |
| $\square$ | **Commit 3.1.3: `feat(CM): implement voting indicator (FR-CM-301)`** | Commit |
| $\square$ | Update the `User Object` in state with a `HasVoted` boolean derived from the `Votes` map. | Sub-Task |
| $\square$ | Update the `<ParticipantList>` component to display a visual indicator (e.g., checkmark) based on `HasVoted`. | Sub-Task |
| $\square$ | **PR 3.2: Reveal Logic and Results Display** | FR-CM-303, FR-CM-304, FR-CM-305 |
| $\square$ | **Commit 3.2.1: `feat(CM): implement reveal cards logic (FR-CM-303)`** | Commit |
| $\square$ | Implement the POST endpoint `/api/session/{id}/reveal`. | Sub-Task |
| $\square$ | Add the `IsRevealed` boolean flip in the session state. | Sub-Task |
| $\square$ | Implement the **automatic reveal** check: if `Votes.size` equals the number of active `VOTER`s, set `IsRevealed` to true. | Sub-Task |
| $\square$ | **Commit 3.2.2: `feat(CM): display revealed results (FR-CM-304)`** | Commit |
| $\square$ | Update the `<ParticipantList>` to display the actual `CardValue` if `IsRevealed` is true. | Sub-Task |
| $\square$ | Implement results calculation: **Minimum**, **Maximum**, and **Average** of the numeric votes. | Sub-Task |
| $\square$ | Display the summary results prominently on the screen after reveal. | Sub-Task |
| $\square$ | **Commit 3.2.3: `feat(CM): implement reset round functionality (FR-CM-305)`** | Commit |
| $\square$ | Implement the POST endpoint `/api/session/{id}/reset` (Facilitator-only). | Sub-Task |
| $\square$ | Clear the `Votes` map and set `IsRevealed` to false. | Sub-Task |
| $\square$ | **Commit 3.2.4: `test(CM): manual tests for voting cycle`** | Commit |
| $\square$ | **Manual Test:** 2 Voters submit votes, verify auto-reveal and results calculation. | Sub-Task |
| $\square$ | **Manual Test:** Facilitator manually triggers reveal before all votes are in. | Sub-Task |
| $\square$ | **Manual Test:** Facilitator uses 'Reset Round' and new votes can be cast. | Sub-Task |

---

### 4. 📚 Epic 4: Story & History Module (FR-SH-400 to FR-SH-403)

**Goal:** Allow the Facilitator to manage the active story text and maintain a non-persistent history of estimated stories.

| Check | Task Description | Requirement |
| :--- | :--- | :--- |
| $\square$ | **PR 4.1: Story Management** | FR-SH-400, FR-SH-401 |
| $\square$ | **Commit 4.1.1: `feat(SH): implement story input endpoint (FR-SH-400)`** | Commit |
| $\square$ | Implement the POST endpoint `/api/session/{id}/story` (Facilitator-only). | Sub-Task |
| $\square$ | Implement validation for max 255 characters. | Sub-Task |
| $\square$ | Update the `CurrentStory` field in the session state. | Sub-Task |
| $\square$ | **Commit 4.1.2: `feat(SH): display active story (FR-SH-401)`** | Commit |
| $\square$ | Implement the `<ActiveStory>` component to prominently display the `CurrentStory` text. | Sub-Task |
| $\square$ | **PR 4.2: History and Archiving** | FR-SH-402, FR-SH-403 |
| $\square$ | **Commit 4.2.1: `feat(SH): implement archive story endpoint (FR-SH-403)`** | Commit |
| $\square$ | Implement the POST endpoint `/api/session/{id}/archive` (Facilitator-only). | Sub-Task |
| $\square$ | Logic to save the `CurrentStory` and the **revealed results** (Min/Max/Avg) to the `History` array. | Sub-Task |
| $\square$ | Clear the `CurrentStory` field, clear `Votes`, and set `IsRevealed` to false (ready for the next estimate). | Sub-Task |
| $\square$ | **Commit 4.2.2: `feat(SH): display in-session history (FR-SH-402)`** | Commit |
| $\square$ | Implement the `<SessionHistory>` component to display the non-persistent list of archived stories and their results. | Sub-Task |
| $\square$ | **Commit 4.2.3: `test(SH): manual tests for history/archive`** | Commit |
| $\square$ | **Manual Test:** Facilitator inputs story, voting completes, Facilitator archives. | Sub-Task |
| $\square$ | **Manual Test:** Verify the story/results appear in the history list and the session is reset for a new story. | Sub-Task |
| $\square$ | **Manual Test:** End session and re-create, verify history is lost (non-persistent). | Sub-Task |

---

### 📝 Memory Bank Update & Final Review

| Check | Task Description | Type |
| :--- | :--- | :--- |
| $\square$ | **PR 4.3: Final Documentation and Review** | PR |
| $\square$ | **Commit 4.3.1: `docs: update Memory Bank with final status`** | Commit |
| $\square$ | Update all rows in the **Memory Bank** (Section 8) to `✅ Completed`. | Sub-Task |
| $\square$ | Summarize implementation notes and any known issues/technical debt in the Memory Bank. | Sub-Task |
| $\square$ | **Commit 4.3.2: `refactor: final code cleanup and lint fixes`** | Commit |
| $\square$ | Final review of all components for adherence to `shadcn/ui` aesthetics and responsiveness. | Sub-Task |
| $\square$ | Run a full project lint/type check and fix all warnings. | Sub-Task |

---

Would you like me to populate the first commit message (`feat: initialize project with React/TS/Vite`) into the **Memory Bank** to officially start the development process?

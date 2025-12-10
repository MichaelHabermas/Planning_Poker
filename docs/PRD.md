# 📋 Product Requirements Document (PRD): Agile Planning Poker App

| Section | Description | Status |
| :--- | :--- | :--- |
| **1. Overview & Goals** | Define the product's purpose and success metrics. | Final |
| **2. Target User & Use Cases** | Identify primary users and core scenarios. | Final |
| **3. Functional Requirements** | Detailed breakdown of features by module/epic. | Draft |
| **4. Technical Specifications** | Define the stack, architecture, and real-time mechanics. | Draft |
| **5. Non-Functional Requirements** | Performance, security, and design standards. | Draft |
| **6. Scope & Future Considerations** | MVP definition and potential roadmap. | Draft |
| **7. Development Workflow** | Epic-based development process and progress tracking. | Final |
| **8. Memory Bank** | Development progress and implementation status. | Active |

---

## 1. 🎯 Overview & Goals

### 1.1. Product Vision

To provide a fast, simple, and collaborative web application for Agile teams to perform story point estimation using the Planning Poker technique, fostering transparency and alignment during sprint planning.

### 1.2. Success Metrics (KPIs)

* **Adoption Rate:** Monthly Active Sessions (MAS). Target: 1,000 MAS within 6 months.
* **Engagement:** Average Session Duration and votes per session.
* **Performance:** Average load time for a new session (target: under 2 seconds).
* **Reliability:** Session stability (uptime and zero reported session-breaking bugs).

---

## 2. 👥 Target User & Use Cases

### 2.1. Target Users

* **Scrum Masters/Agile Facilitators:** Primary user, responsible for session creation, moderation, and driving consensus.
* **Development Team Members (Voters):** Core users who provide the estimations.
* **Product Owners/Stakeholders (Observers):** Users who monitor the process without influencing the vote.

### 2.2. Core Use Case: The Estimation Session

1. **Session Setup:** A Facilitator (creator) starts a new session and shares the unique link/code.
2. **Joining:** Voters and Observers join the session using the unique link and input a display name.
3. **Story Setup:** The Facilitator inputs the story/ticket text being estimated.
4. **Voting:** Voters select a card value. The system indicates when they have voted, but keeps the value hidden.
5. **Reveal:** Once all active Voters have cast a vote, the Facilitator manually triggers the reveal.
6. **Discussion/Recording:** The team discusses the revealed results. The Facilitator notes the final consensus (outside the app's persistence) and archives the story before moving to the next one.

---

## 3. ⚙️ Functional Requirements

The functional requirements are organized into **Epics** for incremental development. Each epic should be completed, tested, and committed before moving to the next one.

### Epic 1: Session Management Module

| ID | Requirement | Roles | Persistence |
| :--- | :--- | :--- | :--- |
| **FR-SM-100** | **Session Creation:** Allow a user (the initial Facilitator) to create a new, unique session instance. This action automatically grants the creator Moderator rights. | Facilitator | No |
| **FR-SM-101** | **Unique Join Link:** Generate a short, unique URL/Code (e.g., `/session/ABC123`) for joining. | Facilitator | No |
| **FR-SM-102** | **Joining:** Users can join by navigating to the unique link/code and entering a **display name**. | All | No |
| **FR-SM-103** | **Active User List:** Display a real-time list of all currently joined participants and their assigned role. | All | No |
| **FR-SM-104** | **Exit/Timeout:** If a user closes the browser or disconnects, their presence is removed after a short timeout (e.g., 60 seconds). | All | No |

### Epic 2: User Roles & Permissions Module (S.O.L.I.D. - Single Responsibility Principle)

The application will enforce three distinct roles: Facilitator, Voter, and Observer.

| Role | Core Actions | Permissions | Default |
| :--- | :--- | :--- | :--- |
| **Facilitator** | Create session, Start/End Vote, Reveal Cards, Assign/Edit Story, Archive Story. | Moderator (Full Control) | Creator of the session. |
| **Voter/Estimator** | Select and submit an estimation card. | Vote, View Story, View Revealed Results. | Default for joining users (if not Moderator/Observer). |
| **Observer** | View active story, View active voters, View revealed results. | View Only. | Manually assigned by Facilitator. |

* **FR-UR-200:** Only the **Facilitator** role has the right to assign the active story text.
* **FR-UR-201:** Only the **Facilitator** role has the right to manually reveal the cards.
* **FR-UR-202:** Only the **Voter** role can interact with the card selection UI to cast a vote.

### Epic 3: Core Voting Mechanics Module

The Fibonacci sequence for estimation will be: **0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, Unsure ($\infty$ or Coffee Cup Symbol)**.

* **FR-CM-300:** **Card Deck:** Display the predefined deck of cards for selection only to the Voter role.
* **FR-CM-301:** **Voting Indicator:** When a Voter casts a vote, their entry in the Active User List must change state (e.g., a green checkmark) to indicate they have voted, but the value remains hidden.
* **FR-CM-302:** **Vote Submission:** Voters can change their vote an unlimited number of times until the cards are revealed. The last submitted vote is the one recorded.
* **FR-CM-303:** **Reveal Cards:** The **Facilitator** can trigger a manual reveal at any time. The cards *must* be automatically revealed if *all* active Voters have cast a vote.
* **FR-CM-304:** **Results Display:** Upon reveal, the system must show:
  * Each Voter's chosen card value next to their name.
  * The **Minimum**, **Maximum**, and **Average** of the numeric votes.
* **FR-CM-305:** **Reset Round:** The **Facilitator** can clear all votes and reset the voting state to start a re-vote for the current story.

### Epic 4: Story & History Module

* **FR-SH-400:** **Story Input:** A text area allowing the **Facilitator** to input or edit the active story's title/description (max 255 characters).
* **FR-SH-401:** **Active Story Display:** The current story text must be prominently displayed to all participants.
* **FR-SH-402:** **History (Non-Persistent):** Maintain a simple, in-session-only list of stories that have been estimated and archived. This history is lost when the Facilitator ends the session or all users leave.
* **FR-SH-403:** **Archive Story:** The **Facilitator** can move the current story and its revealed results into the in-session history. This action automatically clears all votes and the current story field, readying the session for the next estimate.

---

## 4. 💻 Technical Specifications

### 4.1. Tech Stack

* **Frontend:** React, TypeScript, Vite
* **Styling:** Tailwind CSS v4, shadcn/ui (Default theme)
* **Real-time Communication:** Simple Polling Mechanism (For MVP)

### 4.2. Architecture & Data Model (Conceptual)

Following the S.O.L.I.D. Dependency Inversion Principle, the frontend (UI/Components) will be decoupled from the backend service layer.

* **Session State (Server-Side, In-Memory):**
  * `SessionID`: Unique ID (UUID/Short Code).
  * `FacilitatorID`: UserID of the session creator.
  * `CurrentStory`: String.
  * `IsRevealed`: Boolean.
  * `Users`: Map of `UserID` to `User Object`.
  * `Votes`: Map of `UserID` to `CardValue` (only stores value if submitted).
  * `History`: Array of completed `Story` objects (non-persistent).

* **User Object:**
  * `UserID`: UUID generated on join.
  * `DisplayName`: String.
  * `Role`: Enum (`FACILITATOR`, `VOTER`, `OBSERVER`).
  * `HasVoted`: Boolean (derived from `Votes` map).

### 4.3. Real-Time Communication (Polling)

* **Mechanism:** All clients will poll the server on a regular interval (e.g., every 2-3 seconds) to retrieve the current state of the session.
* **Endpoints:**
  * `/api/session/create`: POST (Facilitator)
  * `/api/session/join`: POST (All)
  * `/api/session/{id}/state`: GET (All - Polling endpoint)
  * `/api/session/{id}/vote`: POST (Voter)
  * `/api/session/{id}/story`: POST (Facilitator)
  * `/api/session/{id}/reveal`: POST (Facilitator)
  * `/api/session/{id}/reset`: POST (Facilitator)
  * `/api/session/{id}/archive`: POST (Facilitator)

---

## 5. 🔒 Non-Functional Requirements

### 5.1. Performance

* **Scalability:** The in-memory, non-persistent nature ensures that horizontal scaling is simple, as no shared database state needs managing for session data.
* **Latency:** The 2-3 second polling interval is an acceptable trade-off for simplicity in the MVP. User actions (voting, revealing) should trigger an immediate client-side state update and a rapid server-side update.

### 5.2. Design & Usability

* **Aesthetics:** Adhere strictly to the default shadcn/ui components and design system.
* **Responsiveness:** Must be fully responsive and usable on desktop, tablet, and mobile browsers.

### 5.3. Security & Stability

* **Authentication:** Session IDs/links should be cryptographically secure (e.g., a v4 UUID or a 6-character alphanumeric random code) to prevent unauthorized guessing.
* **Moderation:** All state-changing API calls (e.g., `/reveal`, `/story`, `/reset`) must validate that the request originated from the current session's **Facilitator**.

---

## 6. 🛣️ Scope & Future Considerations

### 6.1. Minimum Viable Product (MVP) Scope

The MVP will strictly include all requirements outlined in Sections 3 and 4, utilizing the simple polling mechanism and in-app, non-persistent story input.

### 6.2. Future Roadmap (Out of Scope for MVP)

1. **Full Persistence:** Integrate a database (e.g., PostgreSQL) to store sessions, history, and user accounts.
2. **Advanced Real-Time:** Upgrade the polling mechanism to WebSockets for instant state updates, reducing server load and improving user experience.
3. **Integration:** Connect to external platforms (e.g., Jira, Trello) to pull story IDs/titles for estimation.
4. **User Management:** Implement persistent user authentication (OAuth/Email) instead of anonymous joining.

---

## 7. 🔄 Development Workflow

### 7.1. Epic-Based Development Process

The development process follows an **epic-by-epic approach** to ensure incremental progress, quality, and maintainability:

1. **Epic Identification:** Each major functional module (Section 3) represents an epic:
   * **Epic 1:** Session Management Module
   * **Epic 2:** User Roles & Permissions Module
   * **Epic 3:** Core Voting Mechanics Module
   * **Epic 4:** Story & History Module

2. **Development Cycle per Epic:**
   * Implement all requirements for the current epic
   * Write and run tests to verify functionality
   * Test manually in the browser/application
   * Ensure code quality (linting, type checking)
   * **STOP** and wait for user verification
   * Create a git commit with a descriptive message (e.g., `feat: implement Epic 1 - Session Management`)
   * Update the Memory Bank (Section 8) with progress
   * **DO NOT** proceed to the next epic until explicitly approved

3. **Commit Standards:**
   * Use conventional commit messages: `feat:`, `fix:`, `refactor:`, `test:`, etc.
   * Include epic number and name in commit message
   * Commit should represent a working, testable state

4. **Testing Requirements:**
   * Each epic must be manually tested before committing
   * Verify all functional requirements (FR-*) for the epic are met
   * Check for regressions in previously completed epics

### 7.2. Memory Bank Usage

The Memory Bank (Section 8) serves as a persistent record of:

* Completed epics and their status
* Current epic in progress
* Known issues or blockers
* Implementation notes and decisions
* Testing status for each epic

**The AI assistant must:**

* Read the Memory Bank at the start of each development session
* Update the Memory Bank after completing each epic
* Reference the Memory Bank when planning next steps
* Never skip or bypass the Memory Bank update process

---

## 8. 📝 Memory Bank

### 8.1. Development Progress

| Epic | Status | Completion Date | Commit Hash | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Epic 1: Session Management** | ⏳ Not Started | - | - | - |
| **Epic 2: User Roles & Permissions** | ⏳ Not Started | - | - | - |
| **Epic 3: Core Voting Mechanics** | ⏳ Not Started | - | - | - |
| **Epic 4: Story & History** | ⏳ Not Started | - | - | - |

**Legend:**

* ⏳ Not Started
* 🚧 In Progress
* ✅ Completed
* ⚠️ Blocked
* 🔄 Needs Review

### 8.2. Current Status

**Active Epic:** None (Project initialization)

**Last Updated:** [To be updated after each epic completion]

**Next Steps:**

1. Set up project structure and dependencies
2. Begin Epic 1: Session Management Module

### 8.3. Implementation Notes

*This section will be updated with technical decisions, architecture choices, and implementation details as development progresses.*

### 8.4. Known Issues & Blockers

*This section will track any issues, blockers, or technical debt discovered during development.*

### 8.5. Testing Status

| Epic | Unit Tests | Integration Tests | Manual Testing | Status |
| :--- | :--- | :--- | :--- | :--- |
| Epic 1 | - | - | - | Not Started |
| Epic 2 | - | - | - | Not Started |
| Epic 3 | - | - | - | Not Started |
| Epic 4 | - | - | - | Not Started |

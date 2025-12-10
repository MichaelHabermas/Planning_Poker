# 📊 DIAGRAMS: Agile Planning Poker App

This document contains all architectural, workflow, and data model diagrams for the Agile Planning Poker application using Mermaid notation.

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Epic Development Workflow](#2-epic-development-workflow)
3. [User Flow Diagrams](#3-user-flow-diagrams)
4. [Data Models](#4-data-models)
5. [API Endpoints](#5-api-endpoints)
6. [State Management](#6-state-management)
7. [Component Hierarchy](#7-component-hierarchy)
8. [Sequence Diagrams](#8-sequence-diagrams)

---

## 1. 🏗️ System Architecture

### 1.1. High-Level Architecture

```mermaid
graph TB
    subgraph Client["Client Layer"]
        UI[React UI Components]
        State[Client State Management]
        Polling[Polling Mechanism<br/>2-3s interval]
    end
    
    subgraph Server["Server Layer"]
        API[REST API Endpoints]
        Session[Session Manager]
        Memory[In-Memory Store]
    end
    
    UI --> State
    State --> Polling
    Polling -->|HTTP GET| API
    UI -->|HTTP POST| API
    API --> Session
    Session --> Memory
    
    style Client fill:#e1f5ff
    style Server fill:#fff4e1
```

### 1.2. Technology Stack

```mermaid
graph LR
    subgraph Frontend[" "]
        React[React 18+]
        TS[TypeScript]
        Vite[Vite]
        Tailwind[Tailwind CSS v4]
        Shadcn[shadcn/ui]
    end
    
    subgraph Backend[" "]
        Node[Node.js]
        Express[Express/Similar]
        InMem[In-Memory Storage]
    end
    
    React --> TS
    TS --> Vite
    Vite --> Tailwind
    Tailwind --> Shadcn
    
    Node --> Express
    Express --> InMem
```

---

## 2. 🔄 Epic Development Workflow

### 2.1. Development Process Flow

```mermaid
flowchart TD
    Start([Start Epic]) --> Implement[Implement Requirements]
    Implement --> Test[Write & Run Tests]
    Test --> Manual[Manual Browser Testing]
    Manual --> Quality[Code Quality Check]
    Quality --> Stop{Pass All Checks?}
    Stop -->|No| Fix[Fix Issues]
    Fix --> Test
    Stop -->|Yes| Wait[STOP - Wait for Approval]
    Wait --> Approve{Approved?}
    Approve -->|No| Fix
    Approve -->|Yes| Commit[Create Git Commit]
    Commit --> Update[Update Memory Bank]
    Update --> Next{More Epics?}
    Next -->|Yes| Start
    Next -->|No| Complete([Development Complete])
    
    style Start fill:#90EE90
    style Wait fill:#FFD700
    style Complete fill:#87CEEB
    style Stop fill:#FFA500
```

### 2.2. Epic Dependency Chain

```mermaid
graph LR
    Task0[Task 0:<br/>Foundation Setup] --> Epic1[Epic 1:<br/>Session Management]
    Epic1 --> Epic2[Epic 2:<br/>Roles & Permissions]
    Epic2 --> Epic3[Epic 3:<br/>Voting Mechanics]
    Epic3 --> Epic4[Epic 4:<br/>Story & History]
    Epic4 --> Final[Final Review &<br/>Documentation]
    
    style Task0 fill:#e1f5ff
    style Epic1 fill:#fff4e1
    style Epic2 fill:#f0e1ff
    style Epic3 fill:#e1ffe1
    style Epic4 fill:#ffe1e1
    style Final fill:#90EE90
```

---

## 3. 👤 User Flow Diagrams

### 3.1. Complete User Journey

```mermaid
flowchart TD
    Start([User Arrives])
    Start --> Role{User Role?}
    
    Role -->|Facilitator| Create[Create New Session]
    Role -->|Voter/Observer| Join[Join Existing Session]
    
    Create --> ShareLink[Share Session Link/Code]
    ShareLink --> Wait[Wait for Participants]
    
    Join --> EnterName[Enter Display Name]
    EnterName --> JoinSession[Join Session]
    JoinSession --> Wait
    
    Wait --> Story[Facilitator Sets Story]
    Story --> Vote[Voters Cast Votes]
    Vote --> AllVoted{All Voted?}
    
    AllVoted -->|No| ManualReveal{Manual Reveal?}
    ManualReveal -->|No| Vote
    ManualReveal -->|Yes| Reveal[Reveal Cards]
    AllVoted -->|Yes| Reveal
    
    Reveal --> Results[Display Results]
    Results --> Discuss[Team Discussion]
    Discuss --> Archive{Archive Story?}
    
    Archive -->|Yes| SaveHistory[Save to History]
    SaveHistory --> NextStory{More Stories?}
    Archive -->|No| Reset[Reset Round]
    Reset --> Vote
    
    NextStory -->|Yes| Story
    NextStory -->|No| End([End Session])
```

### 3.2. Session Creation Flow

```mermaid
sequenceDiagram
    actor F as Facilitator
    participant UI as UI
    participant API as API
    participant Server as Session Manager
    
    F->>UI: Click Create Session
    UI->>API: POST /api/session/create
    API->>Server: Generate SessionID
    Server->>Server: Initialize SessionState
    Server->>Server: Assign FACILITATOR role
    Server-->>API: Return SessionID and State
    API-->>UI: Session Created
    UI->>F: Display Session Link/Code
```

### 3.3. Joining Flow

```mermaid
sequenceDiagram
    actor U as User
    participant UI as UI
    participant API as API
    participant Server as Session Manager
    
    U->>UI: Navigate to session link
    UI->>U: Prompt for Display Name
    U->>UI: Enter Name
    UI->>API: POST /api/session/join
    API->>Server: Validate SessionID
    Server->>Server: Generate UserID
    Server->>Server: Assign VOTER role
    Server->>Server: Add to Users map
    Server-->>API: Return UserID and State
    API-->>UI: Join Successful
    UI->>UI: Start Polling
    UI->>U: Display Session View
```

---

## 4. 📦 Data Models

### 4.1. Session State Model

```mermaid
erDiagram
    SessionState ||--o{ User : contains
    SessionState ||--o{ Vote : contains
    SessionState ||--o{ Story : contains
    
    SessionState {
        string SessionID PK
        string FacilitatorID FK
        string CurrentStory
        boolean IsRevealed
        array History
        timestamp LastActivity
    }
    
    User {
        string UserID PK
        string DisplayName
        enum Role
        boolean HasVoted
        timestamp LastSeen
    }
    
    Vote {
        string UserID FK
        string CardValue
        timestamp SubmittedAt
    }
    
    Story {
        string StoryText
        object Results
        timestamp ArchivedAt
    }
```

### 4.2. Role Hierarchy

```mermaid
graph TD
    Root[User Roles]
    Root --> F[FACILITATOR]
    Root --> V[VOTER]
    Root --> O[OBSERVER]
    
    F --> FP1[Create Session]
    F --> FP2[Set Story]
    F --> FP3[Reveal Cards]
    F --> FP4[Reset Round]
    F --> FP5[Archive Story]
    F --> FP6[Assign Roles]
    
    V --> VP1[Cast Vote]
    V --> VP2[Change Vote]
    V --> VP3[View Story]
    V --> VP4[View Results]
    
    O --> OP1[View Story]
    O --> OP2[View Participants]
    O --> OP3[View Results]
    
    style F fill:#FFD700
    style V fill:#87CEEB
    style O fill:#DDA0DD
```

### 4.3. Card Deck Values

```mermaid
graph LR
    Deck[Fibonacci Deck]
    Deck --> G1[0]
    Deck --> G2[0.5]
    Deck --> G3[1]
    Deck --> G4[2]
    Deck --> G5[3]
    Deck --> G6[5]
    Deck --> G7[8]
    Deck --> G8[13]
    Deck --> G9[20]
    Deck --> G10[40]
    Deck --> G11[100]
    Deck --> G12[∞ Unsure]
    
    style Deck fill:#FFD700
    style G12 fill:#FFB6C1
```

---

## 5. 🔌 API Endpoints

### 5.1. API Endpoint Map

```mermaid
graph TB
    API[REST API]
    
    API --> Session[Session Endpoints]
    Session --> Create[POST /api/session/create]
    Session --> Join[POST /api/session/join]
    Session --> State[GET /api/session/:id/state]
    
    API --> Actions[Action Endpoints]
    Actions --> Vote[POST /api/session/:id/vote]
    Actions --> Story[POST /api/session/:id/story]
    Actions --> Reveal[POST /api/session/:id/reveal]
    Actions --> Reset[POST /api/session/:id/reset]
    Actions --> Archive[POST /api/session/:id/archive]
    
    Create -.->|Returns| SessionID[SessionID + State]
    Join -.->|Returns| UserID[UserID + State]
    State -.->|Returns| FullState[Complete SessionState]
    Vote -.->|Returns| Updated[Updated State]
    
    style Create fill:#90EE90
    style State fill:#87CEEB
    style Vote fill:#FFD700
    style Reveal fill:#FFA500
```

### 5.2. Permission Matrix

```mermaid
graph TD
    subgraph Facilitator Only
        F1[POST /story]
        F2[POST /reveal]
        F3[POST /reset]
        F4[POST /archive]
    end
    
    subgraph Voter Only
        V1[POST /vote]
    end
    
    subgraph All Users
        A1[POST /join]
        A2[GET /state]
    end
    
    subgraph Anonymous
        AN1[POST /create]
    end
    
    style Facilitator fill:#FFD700
    style Voter fill:#87CEEB
    style All fill:#90EE90
```

---

## 6. 🔄 State Management

### 6.1. Polling Mechanism

```mermaid
sequenceDiagram
    participant Client
    participant Timer
    participant API
    participant Server
    
    Client->>Timer: Start Polling
    
    loop Every 2-3 seconds
        Timer->>API: GET /api/session/:id/state
        API->>Server: Fetch SessionState
        Server-->>API: Return State
        API-->>Timer: Return State
        Timer->>Client: Update Local State
        Client->>Client: Re-render Components
    end
```

### 6.2. State Synchronization Flow

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> StorySet: Facilitator Sets Story
    StorySet --> Voting: Voters Begin
    Voting --> Voting: Vote Submitted
    Voting --> Revealed: All Voted or Manual Reveal
    Revealed --> Discussion: Results Displayed
    Discussion --> Archived: Archive Story
    Discussion --> Reset: Reset Round
    Reset --> StorySet
    Archived --> StorySet: Next Story
    Archived --> [*]: End Session
```

---

## 7. 🧩 Component Hierarchy

### 7.1. React Component Tree

```mermaid
graph TD
    App[App Root]
    
    App --> Router[Router]
    Router --> Home[HomePage]
    Router --> Session[SessionPage]
    
    Home --> CreateBtn[CreateSessionButton]
    Home --> JoinForm[JoinSessionForm]
    
    Session --> Header[SessionHeader]
    Session --> Main[MainContent]
    Session --> Sidebar[Sidebar]
    
    Header --> SessionInfo[SessionInfo]
    Header --> ExitBtn[ExitButton]
    
    Main --> Story[ActiveStory]
    Main --> Deck[CardDeck]
    Main --> Results[ResultsDisplay]
    
    Deck --> Card[Card Component]
    
    Results --> Stats[Statistics]
    Results --> VoteList[VoteList]
    
    Sidebar --> Participants[ParticipantList]
    Sidebar --> History[SessionHistory]
    Sidebar --> Controls[FacilitatorControls]
    
    Participants --> User[UserListItem]
    History --> HistoryItem[HistoryItem]
    Controls --> RevealBtn[RevealButton]
    Controls --> ResetBtn[ResetButton]
    Controls --> ArchiveBtn[ArchiveButton]
    
    style App fill:#61dafb
    style Session fill:#e1f5ff
    style Main fill:#fff4e1
    style Sidebar fill:#f0e1ff
```

### 7.2. Component Responsibility Map

```mermaid
graph TD
    Root[Planning Poker Components]
    
    Root --> SM[Session Management]
    Root --> UD[User Display]
    Root --> VI[Voting Interface]
    Root --> StM[Story Management]
    Root --> Res[Results]
    Root --> Hist[History]
    Root --> Ctrl[Controls]
    
    SM --> CreateSession
    SM --> JoinSession
    SM --> SessionHeader
    
    UD --> ParticipantList
    UD --> UserListItem
    UD --> RoleIndicator
    
    VI --> CardDeck
    VI --> Card
    VI --> VoteIndicator
    
    StM --> ActiveStory
    StM --> StoryInput
    StM --> StoryDisplay
    
    Res --> ResultsDisplay
    Res --> Statistics
    Res --> VoteList
    
    Hist --> SessionHistory
    Hist --> HistoryItem
    
    Ctrl --> FacilitatorControls
    Ctrl --> RevealButton
    Ctrl --> ResetButton
    Ctrl --> ArchiveButton
```

---

## 8. 🔁 Sequence Diagrams

### 8.1. Complete Voting Round

```mermaid
sequenceDiagram
    actor F as Facilitator
    actor V1 as Voter 1
    actor V2 as Voter 2
    participant UI as UI
    participant API as API
    participant Server as Server
    
    F->>UI: Set Story Text
    UI->>API: POST /api/session/:id/story
    API->>Server: Update CurrentStory
    Server-->>API: Success
    
    V1->>UI: Select Card value 5
    UI->>API: POST /api/session/:id/vote
    API->>Server: Record Vote
    Server->>Server: Set HasVoted true
    
    V2->>UI: Select Card value 8
    UI->>API: POST /api/session/:id/vote
    API->>Server: Record Vote
    Server->>Server: Check if all voted
    Server->>Server: Auto-reveal trigger
    Server->>Server: Calculate Results
    
    UI->>V1: Display Results
    UI->>V2: Display Results
    UI->>F: Display Results
    
    F->>UI: Click Archive
    UI->>API: POST /api/session/:id/archive
    API->>Server: Save to History
    Server->>Server: Clear votes and story
    Server-->>API: Ready for next story
```

### 8.2. User Timeout and Cleanup

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Server
    participant Timer
    
    User->>Browser: Close Tab/Browser
    Browser->>Browser: Stop Polling
    
    Timer->>Server: Check LastSeen timestamps
    Server->>Server: Identify inactive users
    Server->>Server: Remove User from Users map
    Server->>Server: Remove User votes
    Server->>Server: Update state
```

### 8.3. Epic Implementation Sequence

```mermaid
sequenceDiagram
    actor Dev as Developer
    actor AI as AI Assistant
    participant Code as Codebase
    participant Tests as Test Suite
    participant Git as Git Repo
    participant MB as Memory Bank
    
    Dev->>AI: Start Epic N
    AI->>MB: Read current status
    MB-->>AI: Last completed epic
    
    AI->>Code: Implement requirements
    AI->>Tests: Write tests
    AI->>Code: Run linting
    
    AI->>Dev: Ready for manual testing
    Dev->>Tests: Manual browser tests
    
    alt Tests Pass
        Dev->>AI: Approve epic
        AI->>Git: Create commit
        AI->>MB: Update progress
        MB-->>AI: Updated status
        AI->>Dev: Ready for next epic
    else Tests Fail
        Dev->>AI: Request fixes
        AI->>Code: Fix issues
        AI->>Dev: Re-test please
    end
```

---

## 9. 📋 Functional Requirement Mapping

### 9.1. Epic-to-Requirement Traceability

```mermaid
graph TB
    subgraph E1[Epic 1 - Session Management]
        SM100[FR-SM-100 Session Creation]
        SM101[FR-SM-101 Unique Link]
        SM102[FR-SM-102 Joining]
        SM103[FR-SM-103 User List]
        SM104[FR-SM-104 Exit/Timeout]
    end
    
    subgraph E2[Epic 2 - Roles and Permissions]
        UR200[FR-UR-200 Story Assignment]
        UR201[FR-UR-201 Reveal Permission]
        UR202[FR-UR-202 Vote Permission]
    end
    
    subgraph E3[Epic 3 - Voting Mechanics]
        CM300[FR-CM-300 Card Deck]
        CM301[FR-CM-301 Vote Indicator]
        CM302[FR-CM-302 Vote Submission]
        CM303[FR-CM-303 Reveal Logic]
        CM304[FR-CM-304 Results Display]
        CM305[FR-CM-305 Reset Round]
    end
    
    subgraph E4[Epic 4 - Story and History]
        SH400[FR-SH-400 Story Input]
        SH401[FR-SH-401 Story Display]
        SH402[FR-SH-402 History]
        SH403[FR-SH-403 Archive]
    end
```

### 9.2. Feature Dependency Graph

```mermaid
graph TD
    A[Session Creation] --> B[User Joining]
    B --> C[Role Assignment]
    C --> D[Story Input]
    D --> E[Card Display]
    E --> F[Vote Submission]
    F --> G[Vote Indicator]
    G --> H[Reveal Trigger]
    H --> I[Results Calculation]
    I --> J[Archive Story]
    J --> K[History Display]
    
    C --> L[Permission Checks]
    L --> D
    L --> H
    L --> J
    
    style A fill:#90EE90
    style H fill:#FFD700
    style J fill:#FFB6C1
```

---

## 10. 🎨 UI/UX Flow

### 10.1. Screen States

```mermaid
stateDiagram-v2
    [*] --> Landing
    Landing --> CreateSession: Click Create
    Landing --> JoinPrompt: Click Join or Use Link
    
    CreateSession --> SessionActive
    JoinPrompt --> SessionActive: Enter Name and Join
    
    SessionActive --> WaitingForStory: No Story Set
    SessionActive --> ReadyToVote: Story Set
    
    ReadyToVote --> VotingInProgress: Voters Casting
    VotingInProgress --> VotesRevealed: Reveal Triggered
    
    VotesRevealed --> Discussion: Review Results
    Discussion --> ReadyToVote: Reset Round
    Discussion --> WaitingForStory: Archive Story
    
    SessionActive --> [*]: Exit Session
```

### 10.2. Responsive Layout Structure

```mermaid
graph TB
    subgraph Desktop
        DHeader[Header with Session Info]
        DMain[Main Area with Story and Cards]
        DSide[Sidebar with Participants and History]
    end
    
    subgraph Mobile
        MHeader[Header with Session Info]
        MMain[Main Area with Story and Cards]
        MBottom[Bottom Sheet with Participants]
        MTab[Tabs for History]
    end
    
    Desktop -->|Responsive Breakpoint| Mobile
```

---

## 11. 🔒 Security & Validation Flow

### 11.1. Request Validation Pipeline

```mermaid
flowchart LR
    Request[Incoming Request] --> ValidateSession{Valid SessionID?}
    ValidateSession -->|No| Reject1[401 Unauthorized]
    ValidateSession -->|Yes| ValidateUser{Valid UserID?}
    ValidateUser -->|No| Reject2[403 Forbidden]
    ValidateUser -->|Yes| ValidateRole{Correct Role?}
    ValidateRole -->|No| Reject3[403 Forbidden]
    ValidateRole -->|Yes| ValidateData{Valid Data?}
    ValidateData -->|No| Reject4[400 Bad Request]
    ValidateData -->|Yes| Process[Process Request]
    Process --> Success[200 OK]
    
    style Request fill:#90EE90
    style Success fill:#87CEEB
    style Reject1 fill:#FFB6C1
    style Reject2 fill:#FFB6C1
    style Reject3 fill:#FFB6C1
    style Reject4 fill:#FFB6C1
```

---

## 12. 📊 Memory Bank Status Tracking

### 12.1. Epic Progress Diagram

```mermaid
gantt
    title Epic Development Timeline
    dateFormat YYYY-MM-DD
    section Foundation
    Task 0: Setup & Config    :done, task0, 2024-01-01, 2d
    section Epic 1
    Session Management        :active, epic1, after task0, 3d
    section Epic 2
    Roles & Permissions       :epic2, after epic1, 2d
    section Epic 3
    Voting Mechanics          :epic3, after epic2, 4d
    section Epic 4
    Story & History           :epic4, after epic3, 3d
    section Final
    Documentation & Review    :final, after epic4, 1d
```

### 12.2. Testing Status Matrix

```mermaid
graph TD
    subgraph Testing Layers
        Unit[Unit Tests]
        Integration[Integration Tests]
        Manual[Manual Browser Tests]
        E2E[End-to-End Tests]
    end
    
    Epic1[Epic 1] --> Unit
    Epic1 --> Manual
    
    Epic2[Epic 2] --> Unit
    Epic2 --> Manual
    
    Epic3[Epic 3] --> Unit
    Epic3 --> Integration
    Epic3 --> Manual
    
    Epic4[Epic 4] --> Unit
    Epic4 --> Integration
    Epic4 --> Manual
    Epic4 --> E2E
    
    style Unit fill:#e1f5ff
    style Integration fill:#fff4e1
    style Manual fill:#f0e1ff
    style E2E fill:#90EE90
```

---

## Legend

### Diagram Color Codes

```mermaid
graph LR
    A[Completed/Success] 
    B[In Progress/Active]
    C[Not Started/Pending]
    D[Error/Blocked]
    E[Important/Critical]
    
    style A fill:#90EE90
    style B fill:#FFD700
    style C fill:#87CEEB
    style D fill:#FFB6C1
    style E fill:#FFA500
```

### Common Symbols

- 🏗️ Architecture
- 🔄 Workflow/Process
- 👤 User/Actor
- 📦 Data Model
- 🔌 API/Endpoint
- 🧩 Component
- 🔁 Sequence
- 🎨 UI/UX
- 🔒 Security
- 📊 Status/Progress

---

*This diagram document is maintained alongside the PRD and TASKLIST. All diagrams should be updated when requirements or architecture change.*
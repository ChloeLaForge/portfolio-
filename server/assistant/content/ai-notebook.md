# AI Notebook — Complete Project Context

## What the Project Is

AI Notebook is a visual reasoning and system-building application designed around a middle ground between fully manual system design and AI-generated work that the user may not understand.

The core product principle is:

**AI accelerates construction without outsourcing the reasoning.**

Instead of putting AI in a separate chatbot and asking it to generate a finished answer, AI Notebook places AI directly beside the part of the user's structure where a decision is happening. The user remains involved throughout the build.

The application is built around visual trees on an effectively infinite notebook canvas. Users create a structured representation of a problem, system, plan, or body of knowledge. AI can ask questions, propose new structure, recognize patterns, explain implications, and help reorganize accepted reasoning, but user approval controls accepted structural change.

The goal is to combine:

- the speed of generative AI,
- the clarity of visual systems thinking,
- the inspectability of explicit structure,
- and the control of a human-in-the-loop workflow.

The product should feel like the user's hand-drawn thinking became interactive.

---

# The Problem AI Notebook Addresses

There are two common extremes in AI-assisted work.

### Manual work

The user maintains control and usually understands the reasoning, but constructing and reorganizing complex systems is slow.

### Pure AI chat

AI can produce content quickly, but reasoning is usually flattened into a transcript or generated output. The user can lose visibility into:

- how the answer was constructed,
- what assumptions were made,
- which decisions depend on which other decisions,
- what AI changed,
- and what information should persist.

AI Notebook is designed between those extremes.

### AI Notebook

The user and AI build the same visible system together.

AI can move quickly, but proposed structural changes remain visible and reviewable before becoming part of the accepted system.

The intended tradeoff is:

**speed + control**

The system is intended to remain:

**visible · inspectable · user-controlled**

---

# Core Interaction Model

The application begins with the user's own description of what they are trying to build.

The user provides the first context rather than AI inventing the project scope.

Conceptually:

`User intent -> initial context -> visual structure -> contextual AI decisions -> accepted structured reasoning`

The initial user description establishes what the notebook is actually about. AI can help expand and organize that starting context, but the user defines the system's initial meaning.

A normal build then progresses through a repeated human-AI loop.

## The Five-Step AI Loop

### 1. Locate

The system identifies the relevant branch, node, or region of the current structure and brings that context into focus.

### 2. Ask

AI asks a short, specific question beside the structure the question concerns.

### 3. Propose

Based on the user's answer, AI previews new or changed structure.

The proposed structure is visible but is not yet part of the accepted notebook.

### 4. Decide

The user can accept, deny, redirect, or provide another answer.

### 5. Continue

Accepted structure becomes part of the notebook and AI moves to the next relevant context.

This creates a repeated loop in which AI contributes meaning while the user remains responsible for accepted structural change.

---

# AI Is Contextual Rather Than a Separate Chatbot

A defining feature of AI Notebook is that AI appears where the decision is happening.

For short decisions, the user should not need to mentally translate between a chat transcript and a visual system.

The system therefore supports floating contextual AI interactions positioned near the relevant branch or node.

Examples include:

- asking whether a branch should include another concept,
- clarifying a requirement,
- proposing children beneath a node,
- identifying a related decision elsewhere,
- asking the user to choose between alternatives,
- or suggesting a pattern.

The relevant portion of the tree is visually highlighted while AI is reasoning about it.

Long-form discussion still belongs in the persistent sidebar. The sidebar is the escalation surface when a question is too large, ambiguous, or conversational for a small contextual interaction.

The intended division is:

`small local decision -> floating contextual AI`

`large discussion -> sidebar AI`

---

# Human Authority

AI may:

- read context,
- identify relationships,
- recognize patterns,
- ask questions,
- suggest structure,
- preview changes,
- explain implications,
- identify potential cross-page conflicts,
- and propose alternatives.

AI does not silently rewrite accepted structure.

The general authority rule is:

**AI may read broadly, recognize patterns, ask, suggest, preview, and explain. User approval controls accepted structural change.**

Locked content is even stricter and cannot be modified automatically by AI.

---

# Proposed vs. Accepted Structure

The application deliberately distinguishes between what AI proposes and what the user has accepted.

Unapproved AI structure appears in a muted temporary state.

Accepted structure uses the normal visual treatment.

This allows the user to see exactly what AI is suggesting before committing it.

A proposal can include:

- a new node,
- a branch,
- a subtree,
- a new tree,
- an edit to existing content,
- a related effect elsewhere,
- or a pattern change.

The proposal is rendered separately from accepted persistent state so denial does not require complicated rollback logic.

Approval atomically commits the intended change.

Denial removes the temporary proposal and restores the prior accepted state.

---

# User Can Correct Placement Without Re-Prompting AI

AI determines semantic meaning, not screen coordinates.

This is an important architecture rule.

AI can specify:

- the relevant tree,
- the semantic parent,
- children,
- siblings,
- relationships,
- anchor nodes,
- context nodes,
- and proposed structure.

The frontend geometry engine determines where that content physically belongs.

A user may agree with what AI proposed but disagree with where it appears.

While a proposal is still temporary, the user can move it.

Conceptually:

`AI: Here is what I think.`

`User: Yes, but put it here.`

`Geometry engine: Make room around that location.`

`User: Approve.`

Moving a proposal changes temporary geometry only. It does not require another model call and does not change the semantic proposal.

---

# Notebook Structure

The overall persistent hierarchy is:

`Notebook -> Pages -> Trees -> Nodes`

A notebook can contain:

- a Summary Page,
- multiple standard pages,
- multiple trees per page,
- and a future Need to Change area for cross-page issues.

A standard page should behave as independently as practical.

The AI should prefer reasoning and making proposals within the current page.

If a decision appears to affect another page, the system should identify that relationship and create a review item rather than silently modifying the other page.

---

# The Summary Page

The Summary Page is a user-visible high-level representation of the notebook.

Each standard page can have a corresponding tree or section on the Summary Page.

For example:

`Summary`
- Authentication
- Payments
- Vendors
- Resident Support

The visible Summary Page is normal notebook content.

Behind it, AI can maintain compact semantic metadata describing:

- page purpose,
- major rules,
- architectural decisions,
- dependencies,
- terminology,
- constraints,
- and material changes.

The user sees the useful visual summary rather than the retrieval infrastructure behind it.

---

# Visual Tree Model

AI Notebook is intentionally not a conventional flowchart editor, dashboard, slide canvas, card-based project manager, or traditional chatbot.

The visual reference is a carefully hand-drawn reasoning tree.

The primary visual language includes:

- short text labels,
- thin connecting lines,
- open space,
- subtle hierarchy,
- contextual highlights,
- muted temporary proposals,
- and minimal permanent controls.

Nodes should feel written onto a page rather than placed inside heavy boxes.

The system generally reads:

`top -> bottom between trees`

and:

`left -> right within a tree`

Large concepts begin toward the left and detail expands toward the right.

As structure becomes more detailed, typography can become smaller and denser within readable limits.

---

# Infinite Canvas

The notebook uses an effectively infinite two-dimensional workspace.

Users can:

- pan,
- scroll horizontally,
- scroll vertically,
- zoom in,
- and zoom out.

Zoom changes the view, not the semantic layout.

A user can zoom far out to understand the shape of an entire system and zoom in to inspect detailed reasoning.

At a distant zoom level, the user should still be able to perceive:

- overall tree shape,
- hierarchy,
- major concepts,
- and repeated visual patterns.

---

# Multiple Trees

A page can contain multiple independent trees.

Tree titles appear vertically down the page and do not connect to one another unless a semantic relationship explicitly requires one.

Each tree has its own computed territory or lane.

Trees normally progress:

`Tree 1`
`Tree 2`
`Tree 3`

AI should not become trapped indefinitely inside one branch.

The intended build behavior is to move through the useful frontier of the page, progressing across relevant structure and eventually downward through other trees.

---

# Geometry Engine

A deterministic geometry system handles visual placement.

This is intentionally separated from semantic AI.

The responsibilities are:

### Semantic AI

Determines what concepts exist and how they relate.

### Geometry Engine

Determines where those concepts physically fit.

### Visual Grammar

Controls typography, connectors, density, hierarchy cues, and presentation.

### Proposal Interaction

Controls preview, acceptance, denial, and user-adjusted placement.

### AI Placement

Determines where contextual AI should appear without covering relevant information.

### Pattern System

Controls higher-level visual relationships such as color strategies.

The AI model should not waste calls calculating x/y coordinates, collision resolution, or ordinary reflow.

---

# Geometry Principles

Semantic structure is rigid.

Geometry is flexible.

The geometry engine may change:

- x/y position,
- label wrapping,
- local spacing,
- sibling placement,
- subtree placement,
- later-tree placement,
- connector routing,
- and typography tier within defined rules.

Geometry may not change:

- semantic parent,
- tree membership,
- node meaning,
- or accepted/proposed semantic state.

This prevents visual optimization from accidentally changing what the structure means.

---

# Soft Columns and Branch Placement

Nodes at similar semantic depth attempt to occupy approximate shared x-bands.

These are soft columns rather than a rigid grid.

The priority is:

1. semantic clarity,
2. collision avoidance,
3. compact parent-child relationships,
4. readable text,
5. natural connector lengths,
6. approximate alignment.

If strict alignment produces poor geometry, the engine falls back to branch-relative placement.

Long labels can wrap rather than forcing huge horizontal gaps.

---

# Connectors

Connectors should remain visually close to the text they connect.

The intended rhythm is:

`parent -> short connector -> child`

Lines can be:

- horizontal,
- vertical,
- diagonal,
- or clean angular/elbow combinations.

They should never route through unrelated text or imply a false semantic relationship.

The visual result should feel like a clean reasoning tree rather than a circuit board.

---

# Local-First Reflow

When one part of a tree expands, the entire page should not be globally rearranged unless necessary.

Reflow should ripple outward gradually.

Priority:

1. active descendants,
2. neighboring sibling subtrees,
3. containing branch/tree,
4. tree bounds,
5. later trees below.

This preserves spatial memory.

If one tree grows downward, later trees can shift downward as units rather than having their internal layouts destroyed.

---

# Geometry Authority States

The system distinguishes three geometry authority states.

### Automatic

Default state.

The geometry engine can reposition the content when necessary.

### Manually Positioned

The user intentionally moved the content.

The chosen position becomes a strong geometry preference.

Automatic content should move before manually positioned content.

### Locked

Explicit user protection.

Locked content should not automatically move.

When space is needed:

`Automatic -> move first`

`Manually positioned -> preserve when practical`

`Locked -> do not automatically move`

---

# Context Highlighting

Active reasoning is shown visually through subtle light behind the relevant tree path.

The interface should not use giant borders or dim the entire page.

The goal is to answer:

**What part of my system is AI thinking about right now?**

This context highlighting accompanies local AI questions and proposals.

---

# Node Context

Visible node text is intentionally compressed.

A node may display only a few words while storing richer meaning behind it.

A node can contain or reference:

- visible label,
- purpose summary,
- deeper description,
- relationship metadata,
- pattern metadata,
- lock state,
- accepted/proposed state,
- tree association,
- parent/child relationships,
- position,
- AI context identifiers,
- and creation/update metadata.

This allows the visual map to stay simple while preserving useful semantic information.

---

# Hover Context

Hovering a node can reveal a short explanation of what that part of the tree represents.

The default hover should answer:

**What is this part of the tree for?**

The user can expand for deeper context when available.

This information is temporary and should appear near the relevant node without covering important surrounding structure.

---

# Context Mode

The same contextual information stored behind the tree can be deliberately surfaced to the user.

Context Mode allows the user to move through a finished structure and inspect:

- what a node represents,
- why it exists,
- its purpose,
- and supporting reasoning.

The visual tree can therefore remain clean during normal use while still being inspectable.

The concept is:

**context appears where it belongs.**

---

# Backend Context Buckets

The tree is not only a visualization.

It is also a map for retrieving AI context.

When the user selects or works on a specific node, the system can assemble a targeted context bucket containing only the relevant slice of the notebook.

For example:

`Selected node`
`+ parent/page context`
`+ relevant branch context`
`+ applicable project rules`
`+ recent relevant interaction`
`= AI request context`

Unrelated branches can remain excluded.

This avoids repeatedly sending the entire notebook to the model.

---

# Local-First Context Retrieval

The context system is designed around local-first retrieval.

The AI should normally receive:

1. current user message,
2. active page/tree/node context,
3. relevant accepted working state,
4. compact page/tree semantic summaries,
5. applicable project-level rules,
6. recent relevant conversation,
7. additional context only when needed.

This keeps model calls faster and reduces unnecessary context.

The system should not reread every tree, node, and historical conversation on every API call.

---

# Persistent Database Architecture

The database serves two linked purposes.

### User-visible canonical state

Stores what the user has accepted and should see when reopening the notebook.

This includes:

- notebooks,
- pages,
- trees,
- nodes,
- hierarchy/edges,
- ordering,
- relevant positioning metadata,
- locks,
- completion/checkpoint state,
- visual pattern assignments,
- and overrides.

### AI-only semantic state

Stores compact metadata that helps AI understand the notebook without rereading everything.

This can include:

- project summary,
- page summaries,
- tree summaries,
- important rules,
- entities,
- dependencies,
- semantic tags,
- retrieval terms,
- conflict-sensitive information,
- and compressed prior-session information.

These two layers are related but should not be conflated.

---

# Session State

During an active session, the frontend can contain accepted changes newer than the last canonical database checkpoint.

Therefore, the active frontend working state must be included in AI context.

Conceptually:

`canonical database state`
`-> frontend working state`
`-> user + AI accepted edits`
`-> current session state`

The database remains the durable source of truth, while the active working state is authoritative for what has happened during the current unsaved session.

---

# Save Strategy

The architecture avoids unnecessary full database writes after every tiny interaction.

Canonical saves are appropriate around meaningful boundaries such as:

- page exit,
- marking a tree complete for now,
- explicit checkpoint,
- intentional session close,
- or recovery-related durable commit.

Temporary interactions should not require a full canonical save.

Examples include:

- opening the floating AI,
- asking a question,
- previewing an unaccepted proposal,
- hovering,
- temporary UI state,
- and other noncanonical interactions.

Recovery snapshots can protect active work from browser crashes, lost connections, or accidental closure without treating every interaction as a permanent revision.

---

# Core Data Objects

The proposed persistent architecture includes objects such as:

### notebooks

Top-level notebook/project.

### pages

Individual notebook pages, including types such as:

- summary,
- standard,
- need_to_change.

### trees

Trees belonging to pages.

### nodes

Durable accepted node content.

### node_edges

Optional explicit relationships when parent IDs alone are insufficient.

### node_layout

Geometry and manual-positioning information kept separate from semantic content when possible.

### pattern_profiles

Reusable visual or structural pattern definitions.

### pattern_assignments

Defines where patterns apply.

### project_semantic_context

Compact AI-only understanding of the overall project.

### page_semantic_context

Compact AI-only understanding of a page.

### tree_semantic_context

Compact AI-only understanding of a tree.

### summary_page_links

Links standard pages to their visible Summary Page representation.

### need_to_change_items

Cross-page review proposals.

### sessions

Editing-session boundaries and active context.

### conversation_turns

Stored AI/user interaction history.

### session_summaries

Compressed history used instead of replaying every conversation turn.

### notebook_revisions

Canonical save boundaries.

### recovery_snapshots

Temporary recovery state.

---

# Single Source of Truth Principles

Semantic data and presentation data should remain separated where practical.

For example:

`node content != node coordinates`

A node can change position without changing meaning.

Similarly:

`proposal state != accepted state`

`ephemeral UI state != persistent notebook state`

`conversation history != current semantic structure`

The architecture deliberately keeps these categories separate.

---

# Cross-Page Consistency

Pages are designed as relatively independent reasoning units.

The default assumption is:

`change on Page A -> affects Page A`

not:

`change on Page A -> automatically rewrite Pages B, C, and D`

If AI identifies a possible dependency:

`Page A change`
`-> detect relationship to Page B`
`-> create Need to Change proposal`
`-> leave Page B untouched`

This creates an explicit human-review boundary around cascading changes.

---

# Need to Change

The planned Need to Change system captures cross-page implications.

A review item can include:

- source page/tree/node,
- potentially affected target page/tree/node,
- title,
- description,
- reason,
- importance/severity,
- status,
- and resolution information.

AI can identify and propose these issues.

It should not silently resolve them by rewriting another page.

---

# Pattern System

Color and visual patterns are not hardcoded to one meaning.

Patterns are data-driven.

Possible strategies include:

- different color families for different trees,
- colors representing actions,
- repeated colors representing related concepts,
- semantic categories,
- cross-tree relationships,
- or another user-defined visual grammar.

Patterns are project-wide by default but can have explicit page, tree, or node overrides.

Conceptually:

`Notebook default`
`-> Page override`
`-> Tree override`
`-> Node exception`

AI can recognize a useful pattern and propose it.

A proposed pattern remains temporary until accepted.

Once a valid pattern is established, deterministic frontend logic should continue applying it where possible rather than repeatedly asking AI.

---

# AI Surfaces

The architecture supports three primary AI surfaces.

### Sidebar AI

Used for long-form conversation, initial scoping, larger questions, and cases where local placement is not appropriate.

### Visual AI

Appears directly beside relevant tree structure for short contextual questions and proposals.

### Pattern AI

Recognizes and proposes higher-level visual relationships and pattern rules.

These surfaces share the same notebook context rather than acting as unrelated assistants.

---

# Future AI Lenses

The architecture is designed so the same AI surfaces can later operate through different reasoning lenses without creating separate notebook databases.

Possible lenses include:

- general,
- database,
- backend,
- frontend,
- product,
- consulting,
- and other specialized perspectives.

The persistent notebook state remains shared.

A lens changes how AI reasons about the existing system rather than creating a separate copy of the system.

---

# AI Adapter and Model Boundary

The application architecture includes an AI adapter/provider boundary rather than embedding provider-specific logic throughout the interface.

The AI layer should return semantic information such as:

- proposed structure,
- relevant tree,
- anchor node,
- context node IDs,
- context edge IDs,
- questions,
- alternatives,
- relationships,
- and reasoning metadata.

The frontend uses those IDs to determine:

- where AI appears,
- what should be highlighted,
- what should be protected from overlap,
- and where proposed structure should render.

The model does not return pixel coordinates.

---

# Frontend Responsibility Separation

The implementation conceptually separates components/responsibilities such as:

### Notebook Canvas

Pan, scroll, zoom, coordinate transforms, and viewport state.

### Tree Lane / Territory Manager

Tree ordering, bounds, expansion, and vertical shifting.

### Tree View

One tree and its nodes, edges, title, and status.

### Tree Node

Text, hover, selection, drag anchor, lock state, and proposal/accepted state.

### Tree Edge

Semantic connector rendering and live geometry.

### Context Highlight Layer

Visual indication of active reasoning context.

### Floating AI Question

Short contextual questions with compact response controls.

### Proposal Layer

Temporary proposed nodes, edges, edits, and approval controls.

### Context Toolbar

Manual editing actions.

### Temporary Placement Engine

Shared placement logic for contextual interface elements.

### Pattern Key

Current pattern specification and overrides.

### AI Sidebar

Long-form AI conversation.

### AI Adapter

Provider/model boundary.

### Session History

Session-level undo/redo and history coordination.

The exact component names can change, but these responsibilities should remain separated.

---

# State Separation

The frontend should distinguish at least five categories of state.

### Accepted Persistent State

- accepted nodes,
- accepted edges,
- locks,
- patterns,
- tree status,
- saved positions.

### Temporary Proposal State

- proposed nodes,
- proposed edits,
- proposed pattern changes,
- active alternative preview.

### Ephemeral UI State

- hover target,
- selection,
- contextual toolbar,
- floating question,
- inline inputs,
- temporary placement calculations.

### Session Editing History

- undo,
- redo.

### Backend / Context History

- useful reasoning and events that persist across sessions.

These should not be merged into one undifferentiated state object.

---

# Manual Editing

AI Notebook is not AI-only.

The user can directly manipulate the structure.

The interaction model supports or is designed to support actions such as:

- add,
- edit,
- delete,
- move,
- copy,
- paste,
- lock,
- unlock,
- multi-select,
- and build with AI.

A contextual toolbar appears near selected content rather than occupying the page permanently.

Selection can include arbitrary groups of nodes and is not restricted to a parent-child subtree.

---

# Reusable Output

The visual tree is the working interface, not necessarily the final output.

Accepted reasoning persists as structured data.

That same hierarchy can be reorganized into other forms without reconstructing the reasoning from scratch.

Examples include:

### Presentation

Reorder accepted ideas into a clearer narrative.

### Structured Data

Translate visual relationships into records, fields, or other data-oriented representations.

### Tables

Express accepted branches as rows and columns while preserving their source relationships.

The user first chooses an objective for the transformation.

Nothing should be generated until the user decides how the accepted structure should be reorganized.

The transformation itself can then be previewed and accepted.

This is why the project treats the tree as a reasoning architecture rather than merely a visualization.

---

# Tables Workflow

When enough accepted structure exists, the user can move from Build mode into a Tables-oriented workflow.

The system can offer possible organizational objectives based on the accepted tree.

For example, a page containing a booking workflow might be reorganized around:

- the booking process,
- user roles,
- ticket functionality,
- or a comprehensive support structure.

The user selects the objective.

The system proposes a structured package.

The user reviews it before it becomes accepted output.

The key principle is:

**the tree preserves the reasoning; the table is another representation of that accepted reasoning.**

---

# One Structure, Multiple Views

Because the hierarchy is stored as structured data instead of flattened into a transcript, the same reasoning can be presented through different visual organizations.

Changing the view should not require rebuilding the underlying information.

The system can therefore:

- change visual organization,
- emphasize different relationships,
- preserve parent/child hierarchy,
- and maintain the same semantic source underneath.

This is particularly important for large systems where different views may make different relationships easier to understand.

---

# System View

A zoomed-out system view allows the user to see many or all trees at once.

The purpose is not merely navigation.

It allows the user to perceive:

- breadth,
- depth,
- repeated patterns,
- major branches,
- areas receiving too much or too little attention,
- and relationships across the page.

The same accepted structure can therefore operate at both detailed and system scales.

---

# Why the Tree Is a Context System

The visible hierarchy doubles as a retrieval map.

Each node has a known position in the semantic structure.

Therefore the system can use location in the hierarchy to determine what context is relevant to a particular AI interaction.

Instead of treating the notebook like one giant document, the application can reason from:

`current node -> branch -> tree -> page -> notebook`

and retrieve additional context only as needed.

This makes the visual organization useful both to the human and to the AI.

---

# Current Demonstrated Experience

The portfolio demonstration communicates several implemented or prototyped ideas:

- The user starts the notebook from their own words.
- AI helps structure the initial context.
- AI appears beside the branch where a decision is being made.
- Short contextual questions guide the build.
- Proposed structure is previewed before acceptance.
- The user can accept, deny, or redirect AI proposals.
- AI progresses through the structure rather than remaining a detached chat panel.
- Multiple trees can coexist on one page.
- The system can zoom out to show the broader architecture.
- The same tree can expose hidden contextual meaning through Context Mode.
- Structured reasoning can be reorganized into tables or other downstream forms.
- A deterministic geometry system owns placement.
- The tree can act as a blueprint for future applications and other reasoning workflows.

---

# Current vs. Planned Architecture

The project includes both demonstrated interaction behavior and a larger production architecture.

When describing the project, distinguish between:

### Demonstrated / implemented concepts

Features visibly shown in the working prototype or portfolio, including contextual tree building, proposals, human approval, visual hierarchy, navigation, context demonstrations, and structured-output concepts.

### Production architecture / planned system

The deeper database persistence model, semantic retrieval infrastructure, recovery snapshots, cross-page Need to Change pipeline, richer AI lenses, full pattern architecture, and expanded reusable-output workflows.

Do not falsely claim every architectural specification is fully production deployed if only the prototype behavior has been demonstrated.

---

# Technology Context

The project is a web application with a frontend-centered interactive prototype and a planned/full-stack persistence architecture.

Relevant technical concepts used or designed around the project include:

- React,
- Vite,
- JavaScript/TypeScript-style component architecture,
- Node/API integration patterns,
- Supabase-backed persistence architecture,
- relational data modeling,
- AI/chat model APIs,
- structured model outputs,
- frontend geometry logic,
- persistent semantic context,
- session context,
- API request context assembly,
- human-in-the-loop AI interaction,
- and deterministic frontend rendering.

Provider-specific model details should only be stated when confirmed by the implementation being discussed. The broader architecture deliberately places provider access behind an AI adapter so the interaction model does not depend on one model vendor.

---

# Important Product Distinction

AI Notebook is not primarily a mind-mapping product.

It is not primarily a chatbot with a visualization attached.

The more important idea is that accepted reasoning becomes a persistent, inspectable system.

The visual tree serves simultaneously as:

1. the user's working interface,
2. a representation of semantic relationships,
3. an anchor for contextual AI,
4. a retrieval map for model context,
5. and a reusable source for downstream outputs.

That combination is the central architectural idea of the project.

---

# Reusable Architecture

The longer-term goal is not limited to one notebook interface.

The structured-context architecture can support different applications without rebuilding the reasoning model each time.

Potential applications include:

### Building Applications

Use the tree to organize requirements and preserve the reasoning connecting product decisions to APIs, data, interfaces, and implementation.

Conceptually:

`requirements -> system decisions -> implementation`

This could allow a developer to trace an API, data, or interface decision back to the requirement that created it.

### Consulting / System Mapping

Use the hierarchy to decompose ambiguous problems, identify dependencies, compare branches, preserve assumptions, and transform accepted reasoning into deliverable structures.

### Studying

Use the same architecture to represent concepts, dependencies, explanations, and relationships while allowing AI to question the user within the relevant conceptual context.

These are applications of the same underlying structured-context model rather than unrelated products.

---

# Future Product Direction

The project points toward a reusable reasoning architecture in which AI works against explicit structured context rather than only conversational history.

Future expansion can include:

- richer AI lenses,
- database/backend/frontend reasoning modes,
- more advanced structured-output transformations,
- deeper cross-page dependency detection,
- improved pattern recognition,
- additional application-specific interfaces,
- and reuse of the structured context model in new products.

The architectural goal is:

**one reasoning architecture, multiple products.**

---

# Why This Matters

Traditional AI chat stores reasoning primarily as a conversation.

AI Notebook instead attempts to make reasoning itself inspectable and reusable.

A user can see:

- what exists,
- where it belongs,
- how it relates to other information,
- what AI is currently considering,
- what AI wants to change,
- and whether that change has been accepted.

For AI, the same structure provides a way to retrieve focused context rather than repeatedly ingesting an entire project.

For the user, it provides a way to understand and control what AI is doing.

For downstream applications, it provides structured accepted reasoning that can be transformed without rebuilding the original thought process.

---

# Concise Explanation for Recruiter Questions

If asked what AI Notebook is:

**AI Notebook is a visual system-building tool where users and AI construct structured reasoning together. Instead of keeping AI in a separate chat window, the AI asks questions and proposes changes directly beside the relevant part of a visual tree. The user approves structural changes, and the accepted reasoning persists as structured data that can later be reorganized into other outputs.**

If asked what makes it different:

**The key difference is that AI does not generate an opaque finished system. The user can see the context AI is using, inspect its proposals, approve or reject changes, and preserve the resulting reasoning as reusable structure.**

If asked about the technical idea:

**The frontend separates semantic AI from deterministic geometry. AI decides what concepts and relationships to propose, while the application decides where they render. Behind the visual tree, a structured persistence and semantic-context model is designed to retrieve only the relevant project context for each AI call.**

If asked why the project matters:

**It explores how generative AI can accelerate complex work without removing human understanding and control from the process.**

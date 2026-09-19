# Barclay Woods Community Management Platform

## Project Overview

Barclay Woods is a full-stack community management platform designed around a real homeowner association (HOA) and residential-community use case. The project explores how a fragmented set of community operations can be redesigned as one connected system.

The central problem was not simply creating individual features. Payments, resident requests, property information, community communication, administrative work, and historical records all involve overlapping people and data. The system was therefore designed so these workflows remain connected rather than becoming separate tools.

The platform supports multiple user roles, persistent property and household records, role-aware workflows, community communication, payments, issue reporting, administrative tools, and AI-assisted support.

## Core Problem

Community operations are often fragmented across residents, management, outside vendors, payment systems, email, documents, and informal communication.

Barclay Woods was designed around the idea that:

- Requests, approvals, payments, communication, and property history should remain connected.
- Different users should interact with the same underlying system according to their role and authority.
- Information should have one authoritative source rather than being duplicated across features.
- Historical activity should remain available even when the people associated with a property change.
- Frontend features should reflect a consistent underlying system architecture rather than functioning as isolated screens.

## Core Systems Idea: The Household Is the Durable Object

A major architectural decision is that the household or residential unit is treated as the durable system object.

People can enter or leave a household, but the property itself persists. Therefore:

- Management establishes the household/property record first.
- Invitations associate users with a specific household and role.
- Residents become members of an existing household rather than defining the household themselves.
- Charges and balances belong to the household/unit rather than an individual occupant.
- Payment history remains associated with the household.
- Property operations and historical information can persist across resident turnover.

Conceptually:

`Property -> Household -> Invitation -> Account -> Membership`

This model separates the identity of a person from the long-term identity of the residential unit.

## User Roles

### Management

Management users oversee community operations and have administrative authority.

Depending on the workflow, management can:

- Create and manage households.
- Issue registration invitations.
- Review resident information.
- Manage payments and payment history.
- Review resident submissions.
- Create community events.
- Publish official announcements.
- Pin important community posts.
- Moderate reported content.
- Manage FAQs.
- Work with vendors and operational requests.
- Access administrative and operational workspaces.

### Residents

Residents interact with the system in the context of their assigned household.

Residents can:

- Manage profile information.
- View household balances and payment history.
- Make payments.
- View community information.
- Participate in community discussions.
- Submit events for approval.
- Submit requests or report issues.
- Ask questions through AI support.
- Invite additional household members when permitted.

### Vendors

The architecture also supports a vendor role so outside service providers can participate in appropriate operational workflows without receiving resident or management authority.

## Identity and Account Architecture

Authentication identity and application identity are intentionally separated.

Conceptually:

`User -> Account -> Role Profiles`

Role profiles can include:

- Resident Profile
- Management Profile
- Vendor Profile

This allows a user account to participate in the platform without forcing authentication, community membership, and role-specific information into the same object.

The separation supports:

- Multiple platform roles.
- Role-aware interfaces.
- Independent account lifecycle.
- Future role expansion.
- Consistent authentication.

## Registration and Household Membership

### Management Registration

Management accounts use an invitation-based onboarding process.

Typical flow:

1. A board or management user receives an invitation.
2. The invitation is redeemed.
3. The user authenticates.
4. Account and profile information are completed.
5. The account receives the appropriate management role.

### Resident Registration

Residents join through an invitation associated with a specific household.

Typical flow:

1. A resident receives a unique invitation.
2. The invitation identifies the intended household/unit.
3. The user authenticates.
4. Account and profile information are completed.
5. The resident is linked to the intended household.
6. Additional residents can later be associated with the same household through separate accounts.

The important architectural principle is that the household exists independently of the current resident.

## Platform Experience

The platform brings several community functions into one interface.

Major resident and community surfaces include:

- Home
- Profile and Settings
- HOA Payments
- Community Calendar
- Community Chat
- FAQs
- Tickets / Requests
- AI Support

Management additionally has administrative and operational surfaces for reviewing and coordinating community activity.

## Payments

The payment system is designed around the household ledger.

Key decisions:

- Charges belong to a household/unit rather than an individual occupant.
- Residents can view current balance, due date, statement information, and payment history in one account context.
- Partial payments are supported.
- Checkout is handed off through the Stripe API.
- Barclay Woods does not directly collect card credentials.
- After checkout, the resulting transaction state is recorded against the household ledger.

Conceptually:

`Stripe API -> Checkout -> Transaction Result -> Household Ledger`

This means a resident may change while the financial history of the property remains stable.

## Community Calendar

The calendar provides one shared timeline while supporting different contribution paths.

Residents and management read from the same community calendar, but creation authority differs:

- Residents can submit proposed events.
- Resident submissions enter a review state.
- Management can approve those submissions.
- Management-created events can publish directly because the author already has approval authority.
- Approved operational and social events ultimately appear on the same calendar.

The interface includes calendar views and supports tracking submitted events separately from the shared published timeline.

## Community Chat and Moderation

The Community Chat is designed as an open community communication surface with explicit management authority.

Residents can:

- Read announcements.
- Participate through posts, comments, and replies.
- Report inappropriate or problematic content.

Management can:

- Publish official announcements.
- Pin important posts.
- Review reported content.
- Maintain a separate moderation history.

A key design choice is that reported content enters a moderation workflow rather than simply disappearing from the system. This preserves context and creates a clearer administrative process.

## AI Support

The platform includes an AI support experience intended to help users navigate community information and support workflows.

The AI surface can support activities such as:

- Asking community-related questions.
- Finding relevant information.
- Identifying where a request belongs.
- Assisting with issue reporting.
- Connecting users to appropriate community resources or workflows.

AI is treated as part of the broader platform rather than as a replacement for authoritative system data or management decision-making.

## Shared Workflow Model

The platform was designed around recurring system rules rather than one-off page logic.

Important system concepts include:

- Authoritative data
- Role-aware authority
- Shared workflows
- Stable history

The same concepts are intended to repeat across households, tickets, residents, management, vendors, payments, AI support, and future modules.

## Layered Architecture

Barclay Woods follows a layered architecture separating:

1. Persistent Objects
2. Service Engines
3. Frontend Components

### Persistent Objects

Persistent objects represent current system state.

They own:

- Current data
- Relationships
- Stored-data validation
- Database persistence

They do not own:

- Cross-object business workflows
- Notification delivery
- Authorization decisions
- Activity logging

### Service Engines

Service engines coordinate workflows.

They own:

- Business logic
- Cross-object coordination
- Workflow execution
- State transitions
- Validation between objects
- Notification generation
- Activity creation

Service engines do not act as the permanent source of business data.

### Frontend Components

Frontend components present the state and workflows exposed by the system. The interface is intended to reflect the underlying architecture rather than redefine business rules independently on each page.

## Single Source of Truth

A major design principle is that every piece of information should have one authoritative owner.

Examples include:

- Authentication -> User
- Community Membership -> Account
- Resident Information -> Resident Profile
- Management Information -> Management Profile
- Vendor Information -> Vendor Profile
- Household Structure -> Household
- Household Membership -> Household Member
- Notification Settings -> Notification Preferences
- Historical Events -> Activity

Other parts of the system reference these sources rather than duplicating the same information.

## Authorization

Permission decisions are centralized rather than embedded independently inside persistent objects.

Protected actions are evaluated through the authorization layer before execution.

This is important because the platform contains multiple roles that can interact with the same underlying data in different ways.

For example, a resident and management user may both interact with the community calendar, but their permissions for creating and approving events are different.

## Historical Activity

The system separates current state from historical state.

Meaningful actions create historical Activity records rather than rewriting the past. This supports a stable operational history and makes it possible to understand what occurred even as current state changes.

## Notifications

Business modules are designed to emit events rather than independently deciding how notifications should be delivered.

The notification layer can determine:

- Who should receive a notification.
- Which delivery method is appropriate.
- User notification preferences.
- Creation of the notification itself.

This keeps notification behavior separate from the business workflows that trigger it.

## Core Persistent Objects

The architecture includes objects such as:

- User
- Account
- Resident Profile
- Management Profile
- Vendor Profile
- Household
- Household Member
- Notification Preferences
- Activity

## Core Service Engines

The system architecture includes or anticipates engines such as:

- Profile Creation Engine
- Authorization Engine
- Mode Switching Engine
- Registration Invitation Engine
- Management Operational Hub Engine
- Notification Engine
- Activity Engine
- Submission Engine
- Routing Engine
- Ownership Engine

These engines represent the principle that workflows spanning multiple objects should be coordinated by a service layer instead of being embedded into one data object.

## Technology and Integrations

Technologies and integrations used in the project include:

- React-based web interface
- Supabase for backend data infrastructure and authentication
- Google authentication
- Stripe API for payment checkout
- AI/chat functionality
- Role-aware application state
- Persistent relational data supporting households, users, roles, transactions, submissions, and community activity

## Product and Design Approach

The project combines product design, systems engineering, frontend development, backend architecture, and AI-assisted functionality.

The interface was designed to make complex system relationships understandable to ordinary residents while still exposing more powerful operational capabilities to management.

Instead of presenting users with the underlying architecture directly, the system translates it into familiar experiences such as:

- An account balance
- A calendar
- A community discussion
- A request
- An invitation
- A payment
- An AI conversation

Behind those interfaces, the same ownership, authorization, workflow, and history rules continue to apply.

## Why the Architecture Matters

Barclay Woods is not intended to be a collection of unrelated HOA screens.

The broader systems problem is coordinating multiple actors around shared community objects and workflows.

The architecture therefore emphasizes:

- Stable objects even when people change.
- Clear ownership of information.
- Separation of identity, membership, and role.
- Centralized authorization.
- Shared workflows.
- Immutable historical records.
- Event-driven notifications.
- Separation of data, business logic, and presentation.
- Reusable architectural patterns that can support additional community-management features.

## Project Significance

Barclay Woods demonstrates the design and implementation of a multi-role software system around a real operational problem.

The project required thinking beyond individual UI features to consider:

- How data should be modeled.
- Which entities should persist over time.
- How different users should interact with the same information.
- Where authority should live.
- How workflows should cross multiple objects.
- How payment state should remain tied to a property.
- How community participation can remain open while still supporting moderation.
- How AI can assist users without becoming the authoritative source of system state.
- How new features can be added without creating conflicting sources of truth.

The result is a connected community-management platform in which the frontend experience is backed by a consistent system model.

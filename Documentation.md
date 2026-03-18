# Project Idea

**FlowForge – Business Workflow Automation System**

A web platform that allows companies to **create, track, and automate internal approval processes** such as leave requests, invoices, or purchase approvals.

Think of it like a **mini version of Monday.com / Zapier / Jira workflow**.

---

# Core Problem

Many companies still handle approvals through:

* WhatsApp
* Email
* Excel

This causes:

* lost requests
* slow approval
* no tracking
* no automation

Your system solves this by providing **structured workflows**.

---

# Core Features

### 1️⃣ User Authentication

Roles:

* Employee
* Manager
* Admin

Features:

* Login / register
* Role-based access

---

### 2️⃣ Request Submission

Employees can submit requests like:

* Leave request
* Purchase request
* Invoice reimbursement

Example form:

```
Title
Category
Description
Amount (optional)
Attachment
```

---

### 3️⃣ Approval Workflow

Manager receives requests.

Manager can:

* Approve
* Reject
* Request revision

Each request has a **status**:

```
Pending
Approved
Rejected
In Review
```

---

### 4️⃣ Workflow Tracking

Users can see request progress.

Example:

```
Submitted
↓
Manager Review
↓
Finance Approval
↓
Completed
```

---

### 5️⃣ Dashboard

Show statistics like:

* Total requests
* Pending approvals
* Approval rate
* Monthly requests

Use **charts**.

---

### 6️⃣ Notification System

Example:

* Manager receives notification when new request submitted
* Employee receives notification when approved

---

### 7️⃣ Workflow Builder (Advanced Feature)

Admin can create workflows.

Example:

```
Purchase Request
Step 1 → Manager
Step 2 → Finance
Step 3 → CEO
```

This makes the system **dynamic**.

---

# Suggested Tech Stack (Matches Their Internship)

Frontend

* **React or Next.js**

Backend

* **.NET Core REST API** (this matches their requirement)

Database

* **PostgreSQL / MySQL**

Other Tools

* Git
* Figma (design UI)
* REST API

---

# Database Design Example

Users

```
id
name
email
password
role
```

Requests

```
id
title
description
status
created_by
created_at
```

Approvals

```
id
request_id
approver_id
status
comment
approved_at
```

WorkflowSteps

```
id
workflow_name
step_order
role_required
```

---

# API Examples

```
POST /api/auth/login
POST /api/requests
GET /api/requests
PUT /api/requests/{id}/approve
PUT /api/requests/{id}/reject
GET /api/dashboard
```

This proves you understand **RESTful API design**.

---

# UI Pages

Your system should have around **7–9 pages**

Login
Dashboard
Submit Request
My Requests
Approval Queue
Request Details
Admin Workflow Builder
User Management

---

# Portfolio README (Important)

In GitHub include:

```
Project Overview
Problem Statement
Features
Tech Stack
Architecture Diagram
Database ERD
API Documentation
Screenshots
```

This will look **very professional**.

---

# Even Better (This will impress them)

Add **automation rules**.

Example:

```
If request amount > RM5000
→ require Finance approval
```

This makes your project feel like **real business software**.

---

# 1. System Architecture

Your system should follow a **3-tier architecture** (very common in real companies).

```
Frontend (Client)
      ↓
REST API (Backend)
      ↓
Database
```

More detailed:

```
Browser
   ↓
Next.js / React Frontend
   ↓
REST API (.NET Core)
   ↓
Service Layer (Business Logic)
   ↓
Database Layer (Entity Framework)
   ↓
PostgreSQL / MySQL
```

---

# Architecture Diagram

```
[ User Browser ]
        |
        v
[ React / Next.js Frontend ]
        |
        |  HTTP Request (REST API)
        v
[ .NET Core Web API ]
        |
        |-- Auth Service
        |-- Request Service
        |-- Workflow Service
        |
        v
[ Database (PostgreSQL / MySQL) ]
```

---

# Frontend Structure

Example project structure:

```
frontend/

src
 ├── pages
 │   ├── login
 │   ├── dashboard
 │   ├── requests
 │   ├── approvals
 │   └── admin
 │
 ├── components
 │   ├── Navbar
 │   ├── RequestCard
 │   ├── ApprovalTable
 │   └── Charts
 │
 ├── services
 │   └── api.js
 │
 ├── hooks
 │   └── useAuth.js
 │
 └── styles
```

Frontend responsibilities:

* UI
* Forms
* API calls
* Display data
* Routing

---

# Backend Structure (.NET Core)

```
backend/

Controllers
 ├── AuthController
 ├── RequestController
 ├── ApprovalController
 └── WorkflowController

Services
 ├── AuthService
 ├── RequestService
 └── WorkflowService

Models
 ├── User
 ├── Request
 ├── Approval
 └── WorkflowStep

Data
 └── AppDbContext
```

Backend responsibilities:

* authentication
* business logic
* workflow logic
* API endpoints

---

# Database Design

Tables:

### Users

```
id
name
email
password_hash
role
created_at
```

---

### Requests

```
id
title
description
status
created_by
created_at
workflow_id
```

---

### Approvals

```
id
request_id
approver_id
status
comment
approved_at
step_order
```

---

### Workflows

```
id
name
created_at
```

---

### WorkflowSteps

```
id
workflow_id
step_order
role_required
```

---

# API Example

### Authentication

```
POST /api/auth/login
POST /api/auth/register
```

---

### Requests

```
GET /api/requests
POST /api/requests
GET /api/requests/{id}
```

---

### Approval

```
POST /api/approvals/{requestId}/approve
POST /api/approvals/{requestId}/reject
```

---

### Dashboard

```
GET /api/dashboard/stats
```

---

# 14 Day Development Roadmap

This is a **realistic roadmap**.

---

# Week 1 — Core System

## Day 1 — Project Setup

Setup:

* React / Next.js project
* .NET Core API
* Database

Create Git repo.

---

## Day 2 — Database Design

Create tables:

* Users
* Requests
* Approvals
* Workflows
* WorkflowSteps

Seed initial data.

---

## Day 3 — Authentication System

Build:

* Login API
* Register API
* JWT authentication

Frontend:

* login page

---

## Day 4 — Request System

Employee can:

* submit request
* view requests

Frontend:

* submit request form
* request list

---

## Day 5 — Approval System

Manager can:

* view pending approvals
* approve request
* reject request

---

## Day 6 — Workflow Logic

Implement logic:

```
Request submitted
↓
Send to Step 1 approver
↓
If approved → Step 2
↓
If rejected → End
```

---

## Day 7 — Request Tracking Page

Users can see:

```
Request details
Approval history
Current step
```

---

# Week 2 — Advanced Features

## Day 8 — Dashboard

Add analytics:

* total requests
* pending approvals
* approval rate

Use charts.

---

## Day 9 — Notification System

Basic notifications:

* new request
* request approved
* request rejected

---

## Day 10 — Admin Workflow Builder

Admin can create workflows:

Example:

```
Leave Request
Step 1 → Manager
Step 2 → HR
```

---

## Day 11 — Role Based Access

Restrict pages:

```
Employee → submit requests
Manager → approve
Admin → manage workflows
```

---

## Day 12 — UI Improvement

Improve:

* layout
* tables
* cards
* charts

Make it look like **SaaS software**.

---

## Day 13 — Testing + Bug Fix

Test:

* login
* request flow
* approval flow
* dashboard

Fix bugs.

---

## Day 14 — Portfolio Preparation

Add to GitHub:

README should include:

```
Project Overview
Architecture Diagram
Database ERD
API Endpoints
Screenshots
Tech Stack
```

This is **super important** for recruiters.

---

# Final Result

Your portfolio will show:

✔ Frontend development
✔ REST API
✔ Database design
✔ Business automation system
✔ Role based access
✔ Dashboard analytics

Which **perfectly matches their internship description**.

---
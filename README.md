# FlowForge

FlowForge is a comprehensive internal company workflow and request management platform. It streamlines business processes such as hardware/software purchase requests, IT access approvals, and travel authorizations, providing employees with an intuitive dashboard and robust analytics for managers.

## Key Features

- **Workflow Management:** Customizable multi-step approval workflows (e.g., Employee -> Manager -> Admin).
- **Request Tracking:** Submit requests, view statuses (Pending, Approved, Rejected, In Review), and maintain a clear historical audit trail.
- **Approvals Dashboard:** Dedicated interface for managers and admins to review pending requests by role, with "History" and "Archived" categorization for completed task visibility.
- **Analytics & Insights:** Visual metrics detailing request bottlenecks, average response times, efficiency ratings across workflows, and cost tracking.
- **Role-Based Access Control (RBAC):** Distinct roles (`Employee`, `Manager`, `Admin`) ensures correct visibility and administrative bounds.

## Tech Stack

- **Frontend:** React, Vite, TailwindCSS (for highly responsive and modern aesthetics).
- **Backend:** Node.js, Express.js (RESTful APIs for data management and flow handling).
- **Database:** MySQL 8.0 (Relational schema enforcing constraints on multi-level approvals).
- **Deployment:** Docker & Docker Compose (Containerized multi-tier deployment).

## Quick Start (Docker)

Ensure you have Docker and Docker Compose installed.

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd flow-forge
   ```

2. **Configure Environment:**
   Review and adjust the `.env` file containing the MySQL credentials and JWT secret:
   ```env
   MYSQL_ROOT_PASSWORD=your_root_password
   MYSQL_PASSWORD=your_db_password
   JWT_SECRET=your_secure_secret
   ```

3. **Deploy the application:**
   ```bash
   docker-compose up -d --build
   ```
   This will build the Node API, Vite frontend, and MySQL containers. Nginx will serve the frontend.

4. **Seeding the Database (Optional but Recommended for Testing):**
   ```bash
   # Add historical mock data to populate analytics graphs
   docker exec flowforge-backend node seed_analytics_data.js
   
   # Add immediate pending requests / active pipeline UI tasks
   docker exec flowforge-backend node seed_ui_data.js
   ```

## Services & Ports
- **Frontend (Nginx / React):** Exposes on HTTP host port `8083`.
- **Backend API (Node/Express):** Runs internally on port `5001`.
- **MySQL Database:** Local volume persistence enabled, isolated to Docker network.

## Testing & Default Credentials

Using the default SQL seed configurations embedded inside `flowforge_schema.sql`, default logins are created corresponding to each role:

- **Admin User:** `admin@flowforge.com`
- **Manager:** `manager@flowforge.com`
- **Employee:** `employee@flowforge.com`

**Password for all seed accounts:** `password123` 

## Directory Structure
- `/frontend` - Contains the Vite/React application and Nginx server configuration.
- `/backend` - Contains the Express node server, authentication endpoints, and Javascript seed files.
- `flowforge_schema.sql` - Bootstraps the normalized schema directly during Docker initialization.
- `docker-compose.yaml` - Orchestrates the overarching architecture dependencies.

## Security Practices
- Passwords are homogeneously salted and hashed using `bcrypt` pre-database insertion.
- Authorization relies entirely on headless `JWT` tokens enforcing strict route-level visibility logic.

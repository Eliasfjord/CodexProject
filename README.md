# Insurance CRM

This project provides a simple CRM application for insurance agents. It includes a Node.js backend and a minimal frontend written in vanilla HTML/JavaScript.

## Getting Started

1. Install dependencies (requires Node.js):
   ```bash
   npm install
   ```
2. *(Optional)* run the automated tests:
   ```bash
   npm test
   ```
3. Start the server (this will create `crm.sqlite` if it does not exist and
   import the sample data from `db.json`):
   ```bash
   node server.js
   ```

4. Open your browser and navigate to `http://localhost:3000` to use the CRM.

   You can register a new account from the login page or use the default admin credentials:
   - **Email:** `admin@gmail.com`
   - **Password:** `admin123`

## Features

- Dashboard, calendar, leads and profile pages.
- Add new clients with name, email, phone number, status and notes from the leads page.
- Filter clients by status.
- Passwords are stored securely using bcrypt.
- Record call outcomes and view basic statistics on the dashboard.
- Data is stored in a SQLite database (`crm.sqlite`). On first run the database
  is populated with the contents of `db.json` if the file exists.

This is a foundation for future enhancements such as team management and dashboards.

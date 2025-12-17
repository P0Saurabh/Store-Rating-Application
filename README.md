# Roxiler Systems - Store Rating Application

The **Roxiler Systems Store Rating Application** is a full-stack platform designed to bridge the gap between Store Owners and Users. It enables users to discover stores and submit ratings, while providing Store Owners and Administrators with real-time dashboards to monitor performance and engagement.

**For Whom?**
*   **Users:** To find trusted stores and share feedback.
*   **Store Owners:** To track ratings and improve customer satisfaction.
*   **Admins:** To oversee the entire platform ecosystem.

---

## 🚀 Getting Started

### Prerequisites
Ensure you have the following installed:
*   **Node.js** (v14 or higher)
*   **MySQL** (Database)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd roxiler-systems
    ```

2.  **Install dependencies (Root, Client, and Server):**
    ```bash
    # Install dependencies for both client and server from the root
    npm install
    
    # Or manually:
    cd server && npm install
    cd ../client && npm install
    ```

### Configuration

Create a `.env` file in the `server` directory with the following template:

**server/.env**
```env
PORT=5000
DATABASE_URL=mysql://root:yourpassword@localhost:3306/roxiler_db
JWT_SECRET=your_super_secret_key_here
```
> [!NOTE]
> Update `DATABASE_URL` with your local MySQL credentials.

---

## 🛠 Usage Guide

### Start Development Server
The project is set up to run both client and server concurrently from the root directory.

```bash
# From the root directory
npm start
```
*   **Client:** http://localhost:5173
*   **Server:** http://localhost:5000

### Database Seeding (Demo Data)
To populate the database with test users and stores:
```bash
npm run seed --prefix server
# OR
node server/seed.js
```

---

## 🔗 API Reference

| Endpoint | Method | Description | Payload Example |
| :--- | :--- | :--- | :--- |
| `/api/auth/login` | POST | User Login | `{ "email": "admin@roxiler.com", "password": "..." }` |
| `/api/stores` | GET | Get All Stores | N/A |
| `/api/ratings` | POST | Submit Rating | `{ "storeId": 1, "score": 5 }` |

---

## 📂 Project Structure

```
roxiler-systems/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components (Button, Card, etc.)
│   │   ├── pages/          # Page components (Dashboard, Login, etc.)
│   │   ├── context/        # Auth Context provider
│   │   └── lib/            # Utilities
│   └── ...
├── server/                 # Node/Express Backend
│   ├── config/             # DB Configuration
│   ├── controllers/        # Request handlers (Auth, Store, Stats)
│   ├── middleware/         # Auth & Role middleware
│   ├── models/             # Sequelize Models (User, Store, Rating)
│   ├── routes/             # API Routes
│   ├── scripts/            # Utility scripts (viewData, seed)
│   └── seed.js             # Database seeder
└── package.json            # Root configuration
```

---

## 🔐 Login Demo Credentials

Use these credentials to test different user roles:

### 🛡️ System Administrator
*   **Email:** `admin@roxiler.com`
*   **Password:** `Admin@123`

### 🏪 Store Owners
*   **Email:** `newowner@roxiler.com`
    *   **Password:** `Newowner@123`
*   **Email:** `storeownerid@roxiler.com`
    *   **Password:** `StoreOwner@123`

### 👤 Normal Users
*   **Email:** `user@roxiler.com`
    *   **Password:** `User@123`
*   **Email:** `normaluser@roxiler.com`
    *   **Password:** `NormalUser@123`

---

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

Happy Coding! 🚀

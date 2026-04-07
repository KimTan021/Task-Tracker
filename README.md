# Nexus Flow

**Nexus Flow** is a sophisticated, full-stack project management application built with a focus on architectural precision and real-time collaboration. It provides a seamless experience for managing projects, tasks, and team assignments within a premium, minimalist environment.

---

## 🏛️ The Kinetic Monolith Design

The UI of Nexus Flow is governed by **The Kinetic Monolith** design system. Moving away from cluttered dashboards, it adopts the philosophy of **Architectural Precision**:

*   **No-Line Rule**: Boundaries are defined through tonal shifts and background contrast rather than 1px solid borders.
*   **Atmospheric Depth**: The interface uses a layered surface hierarchy (`surface` to `surface-container-highest`) to create focus and natural lift.
*   **Editorial Typography**: A pairing of **Manrope** for authoritative branding and **Inter** for high-utility data work.
*   **Glassmorphism**: Sophisticated use of backdrop-blur for floating navigation and context menus.

---

## ⚡ Core Features

*   **Dynamic Project Management**: Create and oversee multiple projects with dedicated task boards.
*   **Real-time Collaboration**: Powered by WebSockets (STOMP), task updates and assignments are synchronized instantly across all active users.
*   **Interactive Task Board**: A drag-and-drop interface for intuitive task status management.
*   **Team Orchestration**: Project-based invitations and multi-user task assignments.
*   **Secure Infrastructure**: Robust JWT-based authentication and role-based access control.

---

## 🛠️ Technology Stack

### Backend
*   **Framework**: Spring Boot 4 / Java 17
*   **Security**: Spring Security + JWT (JSON Web Token)
*   **Data Access**: Spring Data JPA + Hibernate
*   **Database**: Support for MySQL and MSSQL
*   **Migrations**: Flyway
*   **Communication**: WebSockets (STOMP/SockJS)
*   **API Docs**: SpringDoc OpenAPI (Swagger)

### Frontend
*   **Framework**: React 19 + Vite 8
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS 4
*   **State Management**: Zustand
*   **Data Fetching**: TanStack React Query v5
*   **Real-time**: StompJS + SockJS
*   **Interactions**: @dnd-kit (Drag-and-Drop)
*   **Navigation**: React Router 7

---

## 📂 Project Structure

```text
.
├── backend             # Spring Boot Application
│   ├── src/main/java   # Java source files
│   └── src/resources   # Config and Flyway migrations
├── frontend            # React/Vite/TypeScript Web App
│   ├── src/components  # Reusable UI components
│   ├── src/pages       # Main application views
│   └── src/store       # Zustand state management
├── database            # SQL Schema and seeding scripts
└── docs                # Additional project documentation
```

---

## 🚀 Getting Started

### Prerequisites
*   **JDK 17** or higher
*   **Node.js 20+**
*   **MySQL** or **MSSQL** instance

### Backend Setup
1.  Navigate to the `backend` directory.
2.  Configure your database connection in `src/main/resources/application.properties`.
3.  Run the application using Maven:
    ```bash
    ./mvnw spring-boot:run
    ```

### Frontend Setup
1.  Navigate to the `frontend` directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

---

## 📖 API Documentation

The project includes integrated API documentation via Swagger. Once the backend is running, you can access the OpenAPI UI at:
`http://localhost:8080/swagger-ui.html`

---

## 📄 License
This project is for internal and educational purposes. All rights reserved.

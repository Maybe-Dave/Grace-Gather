# GraceGather - Next-Gen Church Management System

GraceGather is a modern, AI-powered church management platform designed to streamline operations, track attendance, and engage your community. Built with Next.js 15, MongoDB, and Google Gemini AI.

![GraceGather Dashboard](public/favicon.ico)

## 🚀 Features

-   **📊 Interactive Dashboard:** Real-time analytics on member growth, attendance trends, and upcoming events.
-   **👥 Member Management:** Comprehensive directory with search, filtering, and detailed member profiles.
-   **📅 Attendance Tracking:** Easy-to-use attendance marking for Sunday services with historical data and trend charts.
-   **🗓️ Event Management:** Create and manage church events and services.
-   **🤖 AI Assistant:** Integrated chatbot powered by Google Gemini to answer questions about church data and draft communications.
-   **🔒 Role-Based Access Control (RBAC):** Secure access levels for Super Admins, Member Managers, Attendance Managers, and Viewers.
-   **📱 Responsive Design:** Fully optimized for desktop and mobile devices with a modern, dark-mode friendly UI.
-   **🎨 Beautiful Animations:** Smooth transitions and engaging interactions using Framer Motion.

## 🛠️ Tech Stack

-   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Database:** [MongoDB](https://www.mongodb.com/) (via Mongoose)
-   **Authentication:** [NextAuth.js](https://next-auth.js.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [Lucide React](https://lucide.dev/), [Sonner](https://sonner.emilkowal.ski/) (Toast)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)
-   **Charts:** [Recharts](https://recharts.org/)
-   **AI:** [Google Gemini API](https://ai.google.dev/)

## 🏁 Getting Started

### Prerequisites

-   Node.js 18+ installed
-   MongoDB Atlas account (or local MongoDB instance)
-   Google Cloud API Key (for Gemini AI)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/grace-gather.git
    cd grace-gather
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory and add the following:

    ```env
    # MongoDB Connection
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/gather-app?retryWrites=true&w=majority

    # NextAuth
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=your_super_secret_random_string

    # Google Gemini AI
    GOOGLE_API_KEY=your_google_api_key_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000) to see the app.

## 📂 Project Structure

```
src/
├── app/                # Next.js App Router pages and API routes
│   ├── (dashboard)/    # Protected dashboard routes (layout with sidebar)
│   ├── api/            # Backend API endpoints
│   ├── login/          # Authentication pages
│   └── page.tsx        # Landing page
├── components/         # Reusable UI components
├── lib/                # Utility functions and configurations (db, auth)
├── models/             # Mongoose database models (Member, User, Attendance)
└── types/              # TypeScript type definitions
```

## 🚀 Deployment

The easiest way to deploy GraceGather is using [Vercel](https://vercel.com).

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  Add your Environment Variables in the Vercel dashboard.
4.  Click **Deploy**.

For detailed deployment instructions, see [deployment_guide.md](deployment_guide.md).

## 📄 License

This project is licensed under the MIT License.

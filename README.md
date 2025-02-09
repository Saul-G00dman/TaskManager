# Modern Task Manager
A sleek and intuitive task management application built with Next.js 14, TypeScript, and shadcn/ui components. Features a modern UI with real-time updates, task organization, and responsive design.

## Features
- ✨ Modern, responsive UI with shadcn/ui components
- 📱 Full mobile responsiveness
- 🎯 Create, edit, and delete tasks
- 📅 Due date management with calendar picker
- 🏷️ Automatic task status (overdue, urgent, upcoming)
- ✅ Task completion tracking
- 🌓 Light/Dark mode support
- 🚀 Server Actions for data management
- 🔄 Real-time updates


## Tech Stack

- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- UI Components: shadcn/ui
- Database: MongoDB
- Icons: Lucide Icons
- Date Management: date-fns


## Prereqisites
Before you begin, ensure you have the following **installed**:

- Node.js 18+
- MongoDB
- npm or yarn

## Installation
1. Clone the repository:
**bash**

```
git clone https://github.com/yourusername/task-manager.git
cd task-manager
```

2.Install dependencies:
**bash**
```
npm install
# or
yarn install
```

3.Set up your environment variables:
**bash**
```
cp .env.example .env.local
```

Add your MongoDB connection string to .env.local:
```
MONGODB_URI=your_mongodb_connection_string
```

4. Install required shadcn/ui components:
**bash**
```
npx shadcn-ui@latest add card input textarea button calendar popover dialog badge
```

5. Run the development server
**bash**
```
npm run dev
# or
yarn dev
```


## Acknowledgments

- shadcn/ui for the beautiful UI components
- Next.js team for the amazing framework
- Vercel for hosting solutions


 

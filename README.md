# 📁 File Storage Application

A full-stack file storage application with folder hierarchy, file sharing, and user authentication.

## 🌐 Live Demo

**👉 [https://file-storage-sandy.vercel.app](https://file-storage-sandy.vercel.app)**

| Service | Platform |
|---------|----------|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Railway](https://railway.app) |
| File Storage | [Supabase](https://supabase.com) S3 |

---

## ✨ Features

- 🔐 User registration and authentication (JWT)
- 📂 Hierarchical folder structure
- ⬆️ File upload/download with S3 storage
- 🤝 File and folder sharing with role-based permissions (Viewer/Editor)
- 🔍 Search functionality
- 🧹 Automatic cleanup of orphaned S3 files

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| NestJS | Node.js framework |
| Prisma ORM | Database toolkit |
| PostgreSQL | Relational database |
| JWT | Authentication |
| AWS SDK | S3-compatible storage |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI library |
| Vite | Build tool |
| TailwindCSS | Styling |
| React Query | Server state management |
| Zustand | Client state management |
| React Hook Form + Zod | Forms & validation |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| Docker & Docker Compose | Containerization |
| MinIO | S3 storage (local dev) |
| Nginx | Production web server |

---

## 🚀 Quick Start with Docker

### Prerequisites

- Docker and Docker Compose

### Run

```bash
# Clone the repository
git clone <repository-url>
cd file-storage

# Start all services
docker-compose up --build
```

### Access

| Service | URL |
|---------|-----|
| 🖥 Frontend | http://localhost |
| ⚙️ Backend API | http://localhost:3000 |
| 📚 Swagger Docs | http://localhost:3000/api |
| 🗄 MinIO Console | http://localhost:9001 |

> 💡 Default credentials are preconfigured in `docker-compose.yml`. For production, create a `.env` file based on `.env.example`.

---

## 🔧 Manual Setup (Development Mode)

> ⚠️ Requires PostgreSQL and MinIO running locally (or use `docker-compose up postgres minio createbuckets`)

### Backend

```bash
cd server
npm install
cp .env.example .env    # Edit if needed
npx prisma migrate dev
npm run start:dev
```

### Frontend

```bash
cd client
npm install
cp .env.example .env    # Edit if needed
npm run dev
```

---

## 📚 API Documentation

Swagger documentation is available at `/api` endpoint:
- **Local**: http://localhost:3000/api

---

## 📁 Project Structure

```
file-storage-task/
├── 📂 client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── api/              # API client
│   │   ├── components/       # Reusable UI components
│   │   ├── features/         # Feature-specific modules
│   │   ├── pages/            # Page components
│   │   ├── router/           # Routing configuration
│   │   ├── store/            # Zustand state management
│   │   └── types/            # TypeScript types
│   ├── .env.example          # Frontend env template
│   └── Dockerfile
├── 📂 server/                 # Backend (NestJS)
│   ├── src/
│   │   ├── auth/             # Authentication module
│   │   ├── files/            # Files management
│   │   ├── folders/          # Folders management
│   │   ├── share/            # Sharing functionality
│   │   ├── search/           # Search functionality
│   │   ├── storage/          # S3 storage service
│   │   ├── permissions/      # Access control
│   │   ├── cleanup/          # S3 cleanup scheduler
│   │   └── prisma/           # Database service
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── .env.example          # Backend env template
│   └── Dockerfile
├── docker-compose.yml         # Docker orchestration
├── .env.example              # Docker env template
└── README.md
```

---

## 📜 Available Scripts

### Backend (`/server`)

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start dev server with hot reload |
| `npm run start:prod` | Start production server |
| `npm run build` | Build for production |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio |

### Frontend (`/client`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run typecheck` | TypeScript type checking |

---

## ⚙️ Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_USER` | PostgreSQL username | `admin` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `secret` |
| `POSTGRES_DB` | Database name | `filestorage` |
| `MINIO_ROOT_USER` | MinIO username | `admin` |
| `MINIO_ROOT_PASSWORD` | MinIO password | `password123` |
| `MINIO_BUCKET_NAME` | S3 bucket name | `files` |
| `JWT_SECRET` | JWT signing secret | `change_this_secret_in_production` |

---

## 📄 License

This project is created as a test assignment.


# University CRM Frontend

A modern React-based frontend for the University Course Management System with role-based access control, AI integrations, and real-time features.

## Features

- **Authentication & Authorization**: JWT-based auth with role-specific dashboards
- **Course Management**: Browse, enroll, create, and manage courses
- **Assignment System**: Submit, grade, and track assignments
- **AI Assistant**: Course recommendations and syllabus generation
- **Real-time Updates**: WebSocket integration for live notifications
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context + Hooks
- **HTTP Client**: Axios
- **Real-time**: WebSocket API
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see backend README)

## Installation

### Local Development

1. Clone the repository and navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Copy environment variables:

```bash
cp .env.example .env
```

4. Update environment variables in `.env`:

```
VITE_API_BASE_URL=http://localhost:3001/api
VITE_WS_URL=ws://localhost:3001
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

5. Start development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Docker Development

```bash
# Build and run with docker-compose (from project root)
docker-compose up --build
```

## Sample Credentials

Use these credentials to test different roles:

**Student Account:**

- Email: `student@university.edu`
- Password: `password123`

**Lecturer Account:**

- Email: `lecturer@university.edu`
- Password: `password123`

**Admin Account:**

- Email: `admin@university.edu`
- Password: `password123`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components (Layout, Header, etc.)
│   ├── auth/           # Authentication components
│   ├── courses/        # Course-related components
│   ├── assignments/    # Assignment components
│   └── ai/             # AI assistant components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API and external services
├── context/            # React context providers
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and constants
└── assets/             # Static assets
```

## Key Features

### Role-Based Access Control

- **Students**: View enrolled courses, submit assignments, see grades
- **Lecturers**: Create courses, manage enrollments, grade assignments
- **Admins**: System-wide management, user administration, analytics

### AI Integration

- **Course Recommendations**: AI-powered course suggestions based on interests
- **Syllabus Generation**: Automated syllabus creation for new courses
- Uses OpenAI API or mock responses for development

### Real-time Features

- Live enrollment notifications
- Real-time grade updates
- Assignment submission alerts
- WebSocket-based communication

## Environment Variables

| Variable              | Description                    | Default                     |
| --------------------- | ------------------------------ | --------------------------- |
| `VITE_API_BASE_URL`   | Backend API URL                | `http://localhost:3001/api` |
| `VITE_WS_URL`         | WebSocket server URL           | `ws://localhost:3001`       |
| `VITE_OPENAI_API_KEY` | OpenAI API key for AI features | -                           |

## API Integration

The frontend communicates with the backend through:

- **REST API**: Standard CRUD operations
- **WebSocket**: Real-time updates and notifications
- **File Upload**: Assignment and syllabus file handling

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Verify backend is running on correct port
   - Check CORS configuration
   - Ensure environment variables are correct

2. **WebSocket Connection Failed**
   - Check WebSocket URL in environment
   - Verify backend WebSocket server is running
   - Check browser network tab for connection errors

3. **Build Failures**
   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
   - Check TypeScript errors: `npm run type-check`
   - Verify all dependencies are compatible

## License

This project is licensed under the MIT License.

import React from 'react';
import {
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useCheckTrialStatus } from './hooks/useQueries';
import Layout from './components/Layout';
import ProfileSetupModal from './components/ProfileSetupModal';
import TrialExpiredModal from './components/TrialExpiredModal';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AITutor from './pages/AITutor';
import DocumentUpload from './pages/DocumentUpload';
import NotesGenerator from './pages/NotesGenerator';
import ExamQuestions from './pages/ExamQuestions';
import Mentorship from './pages/Mentorship';
import AdaptiveLearning from './pages/AdaptiveLearning';

// ─── Root layout with auth guard ─────────────────────────────────────────────

function RootLayout() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: trialActive, isLoading: trialLoading } = useCheckTrialStatus();

  const isAuthenticated = !!identity;

  const showProfileSetup =
    isAuthenticated &&
    !profileLoading &&
    isFetched &&
    profile === null;

  const showTrialExpired =
    isAuthenticated &&
    !profileLoading &&
    isFetched &&
    profile !== null &&
    !trialLoading &&
    trialActive === false &&
    !profile?.subscriptionActive;

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading BioMentor AI...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProfileSetupModal open={showProfileSetup} />
      <TrialExpiredModal open={!showProfileSetup && showTrialExpired} />
      <Layout>
        <Outlet />
      </Layout>
    </>
  );
}

// ─── Index page — shows landing or dashboard depending on auth ────────────────

function IndexPage() {
  const { identity } = useInternetIdentity();
  if (identity) {
    return <Dashboard />;
  }
  return <LandingPage />;
}

// ─── Routes ──────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard,
});

const tutorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tutor',
  component: AITutor,
});

const documentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/documents',
  component: DocumentUpload,
});

const notesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notes',
  component: NotesGenerator,
});

const examQuestionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/exam-questions',
  component: ExamQuestions,
});

const mentorshipRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mentorship',
  component: Mentorship,
});

const adaptiveLearningRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/adaptive-learning',
  component: AdaptiveLearning,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  tutorRoute,
  documentsRoute,
  notesRoute,
  examQuestionsRoute,
  mentorshipRoute,
  adaptiveLearningRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return <RouterProvider router={router} />;
}

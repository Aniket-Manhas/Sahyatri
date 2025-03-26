import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PNRStatusChecker from '../components/pnr/PNRStatusChecker';

// Lazy loaded components
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const Profile = lazy(() => import('../pages/user/Profile'));
const TrainMap = lazy(() => import('../pages/maps/TrainMap'));
const IndoorMap = lazy(() => import('../pages/maps/IndoorMap'));
const TrainBooking = lazy(() => import('../pages/booking/TrainBooking'));
const TransportBooking = lazy(() => import('../pages/booking/TransportBooking'));
const PnrStatus = lazy(() => import('../pages/pnr/PnrStatus'));
const VoiceAssistantPage = lazy(() => import('../pages/assistant/VoiceAssistantPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: 'login',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: 'register',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Register />
          </Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'booking/train',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedRoute>
              <TrainBooking />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'booking/transport',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedRoute>
              <TransportBooking />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'map',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <TrainMap />
          </Suspense>
        ),
      },
      {
        path: 'station/:stationId',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <IndoorMap />
          </Suspense>
        ),
      },
      {
        path: 'pnr',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedRoute>
              <PNRStatusChecker />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'assistant',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedRoute>
              <VoiceAssistantPage />
            </ProtectedRoute>
          </Suspense>
        ),
      }
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
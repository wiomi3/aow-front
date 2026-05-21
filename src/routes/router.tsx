import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import { Toaster } from 'sonner';
import Login from '../components/login';
import { authClient } from '../lib/auth-client';
import { Header } from '../components/layout/Header';
import { AdminLayout } from '../components/layout/AdminLayout';
import PublicCalendar from '../pages/public/PublicCalendar';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminCalendar from '../pages/admin/Calendar';
import AdminLocations from '../pages/admin/Locations';
import AdminEventTypes from '../pages/admin/EventTypes';
import AdminEmployees from '../pages/admin/Employees';
import AdminAdditionalOrgs from '../pages/admin/AdditionalOrgs';

// Root Layout Component
function RootLayout() {
  return (
    <div className="bg-background text-foreground min-h-screen font-sans antialiased">
      <Toaster position="top-right" richColors />
      <Header />
      <main className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

// Root Route
const rootRoute = createRootRoute({
  component: RootLayout,
});

// Public Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: PublicCalendar,
});

// Admin Routes (Protected Container)
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'admin',
  beforeLoad: async () => {
    const sessionResponse = await authClient.getSession();
    if (!sessionResponse.data) {
      throw redirect({
        to: '/admin/login',
      });
    }
  },
  component: AdminLayout,
});

const adminIndexRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/',
  component: AdminDashboard,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'admin/login',
  beforeLoad: async () => {
    const sessionResponse = await authClient.getSession();
    if (sessionResponse.data) {
      throw redirect({ to: '/admin' });
    }
  },
  component: Login,
});

const adminCalendarRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: 'calendar',
  component: AdminCalendar,
});

const adminLocationsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: 'locations',
  component: AdminLocations,
});

const adminEventTypesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: 'event-types',
  component: AdminEventTypes,
});

const adminEmployeesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: 'employees',
  component: AdminEmployees,
});

const adminAdditionalOrgsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: 'additional-orgs',
  component: AdminAdditionalOrgs,
});

// Route Tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  adminLoginRoute,
  adminRoute.addChildren([
    adminIndexRoute,
    adminCalendarRoute,
    adminLocationsRoute,
    adminEventTypesRoute,
    adminEmployeesRoute,
    adminAdditionalOrgsRoute,
  ]),
]);

// Create Router
export const router = createRouter({ routeTree });

// Register for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

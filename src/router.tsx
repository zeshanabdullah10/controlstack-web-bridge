import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import Overview from './views/Overview';
import Controls from './views/Controls';
import Monitoring from './views/Monitoring';
import Analytics from './views/Analytics';
import Settings from './views/Settings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Overview />,
      },
      {
        path: 'controls',
        element: <Controls />,
      },
      {
        path: 'monitoring',
        element: <Monitoring />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}

export default router;

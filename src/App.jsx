import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Students from './pages/Students/Students';
import Teachers from './pages/Teachers/Teachers';
import Courses from './pages/Courses/Courses';
import FeeManagement from './pages/FeeManagement/FeeManagement';
import Reports from './pages/Reports/Reports';
import Settings from './pages/Settings/Settings';
import Attendance from './pages/Attendance/Attendance';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'students',
        element: <Students />,
      },
      {
        path: 'teachers',
        element: <Teachers />,
      },
      {
        path: 'courses',
        element: <Courses />,
      },
      {
        path: 'fees',
        element: <FeeManagement />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'attendance',
        element: <Attendance />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

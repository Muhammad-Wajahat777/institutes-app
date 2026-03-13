import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Students from './pages/students/Students';
import Teachers from './pages/teachers/Teachers';
import Courses from './pages/courses/Courses';
import FeeManagement from './pages/feemanagement/FeeManagement';
import Reports from './pages/reports/Reports';
import Settings from './pages/settings/Settings';
import Attendance from './pages/attendance/Attendance';

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

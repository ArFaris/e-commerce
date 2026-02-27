import ReactDOM from 'react-dom/client';
import 'styles/global.scss'
import { routesConfig } from './config/routes.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router';

const router = createBrowserRouter(routesConfig);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLDivElement
);

root.render(
  <RouterProvider router={router} />
)
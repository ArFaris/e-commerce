import { Navigate, type RouteObject } from 'react-router';
import App from '../App';
import ProductsPage from '../App/pages/ProductsPage';
import ProductPage from '../App/pages/ProductPage';
import CategoriesPage from 'App/pages/CategoryPage';

export const routes = {
    main: {
        mask: "/",
        create: () => "/",
    },
    products: {
        mask: "/products",
        create: () => "/products",
    },
    product: {
        mask: "/products/:id",
        create: (id: string) => `/products/${id}`
    },
    categories: {
        mask: "/categories",
        create: () => "/categories"
    }
}

export const routesConfig: RouteObject[] = [
    {
        path: routes.main.mask,
        element: <App />,
        children: [
            {
                index: true,
                element: <ProductsPage />
            },
            {
                path: routes.products.mask,
                element: <ProductsPage />
            },
            {
                path: routes.product.mask,
                element: <ProductPage />
            },
            {
                path: routes.categories.mask,
                element: <CategoriesPage />
            }
        ]
    },
    {
        path: "*",
        element: <Navigate to={routes.main.mask} replace />
    }
];
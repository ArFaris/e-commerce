import { Navigate, type RouteObject } from 'react-router';
import App from '../App';
import ProductsPage from '../App/pages/ProductsPage';
import ProductPage from '../App/pages/ProductPage';
import CategoriesPage from '../App/pages/CategoriesPage';
import CategoryPage from '../App/pages/CategoryPage';
import AuthPage from 'App/pages/AuthPage';
import SignInPage from 'App/pages/SignInPage';
import OrderPage from 'App/pages/OrderPage';

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
    },
    category: {
        mask: "/categories/:name",
        create: (name: string) => `/categories/${name}`
    },
    auth: {
        mask: "/auth",
        create: () => `/auth`
    },
    login: {
        mask: "/login",
        create: () => `/login`
    },
    order: {
        mask: "/order",
        create: () => `/order`
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
            },
            {
                path: routes.category.mask,
                element: <CategoryPage />
            },
            {
                path: routes.auth.mask,
                element: <AuthPage />
            },
            {
                path: routes.login.mask,
                element: <SignInPage />
            },
            {
                path: routes.order.mask,
                element: <OrderPage />
            }
        ]
    },
    {
        path: "*",
        element: <Navigate to={routes.main.mask} replace />
    }
];
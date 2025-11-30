import { HomePage, TasksPage, ProfilePage , OrderPage} from './pages';
import { withNavigationWatcher } from './contexts/navigation-hooks';
import { Product } from './pages/products/products';

const routeData = [
    {
        path: '/tasks',
        element: TasksPage
    },
    {
        path: '/profile',
        element: ProfilePage
    },
    {
        path: '/home',
        element: HomePage
    },
    {
        path: '/orders',
        element: OrderPage
    },
    {
        path: '/products',
        element: Product
    }
];

export const routes = routeData.map(route => {
    return {
        ...route,
        element: withNavigationWatcher(route.element, route.path)
    };
});

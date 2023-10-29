import {
    createWebHistory,
    createRouter
} from "vue-router";
import HomePage from '@/components/HomePage';
import ProductDetailPage from '@/components/ProductDetailPage';
import CartPage from '@/components/CartPage';
import LoginPage from '@/components/LoginPage';
import CheckoutPage from '@/components/CheckoutPage';

const routes = [{
        path: "/",
        name: "Home",
        component: HomePage,
    },
    {
        path: '/product/:id',
        component: ProductDetailPage,
        props: true
    },
    {
        path: '/cart',
        component: CartPage,
    },
    {
        path: '/login',
        component: LoginPage,   
    },
    {
        path: '/checkout',
        component: CheckoutPage,   
    },

];
// tạo đốit tượng từ router
const router = createRouter({
    history: createWebHistory(),
    routes,
});
// để cho các lớp khác nhìn thấy nó thì phải export
export default router
import Main from './Main/index';
import Page from './page/index';

const router = [
    {
        path: '/',
        name: 'main',
        component: Main
    },
    {
        path: '/app',
        name: 'main2',
        component: Main
    },
    {
        path: '/page',
        name: 'app',
        component: Page
    }
]

export default router;

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('./../App.vue')
        },
        {
            path: '/:pathMatch(.*)*', 
            redirect: { name: 'home' }
        }
    ]
})

export default router
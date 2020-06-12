import Vue from 'vue'
import Home from './components/Home'
import Auth from './components/Auth'
import Board from './components/Board'
import LearnMore from './components/LearnMore'
import VueRouter from 'vue-router';
import store from './store'

Vue.use(VueRouter)

const routes = new VueRouter({
    mode: 'history',
    routes: [
        {
            name: 'home',
            path: '/',
            component: Home
        },
        {
            name: 'learn',
            path: '/learnmore',
            component: LearnMore
        },
        {
            name: 'login',
            path: '/login',
            component: Auth,
            props: {
                action: 'login'
            }
        },
        {
            name: 'signup',
            path: '/signup',
            component: Auth,
            props: {
                action: 'signup'
            }
        },
        {   name: 'reset',
            path: '/resetpassword',
            component: Auth,
            props: {
                action: 'reset'
            }
        },
        {   name: 'board',
            path: '/board/:name',
            component: Board
        },
    ]
});

routes.beforeEach((to, from, next) => {
    let userIsLogged = store.state.currentUser && !store.state.currentUser.isAnonymous
    if (["login", "signup", "reset"].find(element => to.name === element) && userIsLogged) {
        // Redirect user to homepage
        return next({path: '/'})
    }
    
    return next()
})

export default routes;

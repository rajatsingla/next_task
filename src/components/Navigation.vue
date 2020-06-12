<template>
    <div id="site-header">
    <b-navbar class="items">
        <template slot="brand">
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
                <img
                        src="../../public/icon.png"
                        alt="Awake"
                >
            </b-navbar-item>
        </template>
        <template slot="start">
        </template>
        <template slot="end">
            <router-link to="/learnmore" class="has-text-grey navbar-item">
                Learn more
            </router-link>
            <b-navbar-item tag="div">
                <div v-if="currentUser && !currentUser.isAnonymous" class="navbar-item">
                    <a @click="logout">Logout</a>
                </div>
                <div v-else class="buttons">
                    <router-link to="/signup" class="button is-primary">
                        <strong>Sign up</strong>
                    </router-link>
                    <router-link to="/login" class="button is-light">
                        Login
                    </router-link>
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>
    </div>
</template>


<script>
    import { mapState, mapActions } from 'vuex'
    const fb = require('../firebaseConfig.js')

    export default {
        computed: {
            ...mapState(['currentUser'])
        },
        methods: {
            ...mapActions(['clearData']),
            logout() {
                fb.auth.signOut().then(() => {
                    this.clearData()
                    this.$router.push('/login')
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    }
</script>

<style lang="scss">
    #site-header {
        box-shadow: 0 2px 4px 0 rgba(0,0,0,.08);
        background-color: white;
        transition: background-color .5s;
        display: flex;
        justify-content: center;
        min-height: 74px;
    }
    #site-header .items {
        max-width: 1500px;
        width: 100%;
        display: flex;
    }
    #site-header .navbar-item {
        font-size: 18px;
        font-weight: bold;
    }
    @media (max-width: 1023px) {
        #site-header {
            min-height: auto;
            .items {
                flex-direction: column;
            }
            .navbar-item .button {
                display: block;
            }
        }
    }

</style>
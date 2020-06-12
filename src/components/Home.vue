<template>
    <main class="container">
        <div v-if="!currentUser || currentUser.isAnonymous" class="welcome-msg">
            Hello Friend<div class="title is-6 has-text-danger"> Signup to save progress</div>
        </div>
        <div v-else class="welcome-msg">
            Hello <span class="is-capitalized">{{userProfile.name}}</span>
        </div>
        <Boards></Boards>
    </main>
</template>
<script>
    import { mapState } from 'vuex'
    import Boards from './Boards'
    export default {
        computed: {
            ...mapState(['currentUser', 'userProfile'])
        },
        components:{
            Boards
        }
    }
</script>

<style lang="scss">
    .welcome-msg{
        padding-top: 3rem;
        padding-bottom: 2.5rem;
        font-size: 24px;
        font-family: VisbyRoundCF,sans-serif;
        color: #000!important;
    }
    @media screen and (max-width: 1024px) {
        .welcome-msg {
            font-size: 20px;
            padding-top: 1.5rem;
            padding-bottom: 1.2rem;
        }
    }
    @media (max-width: 480px) {
        .welcome-msg {
            font-size: 18px;
            padding-top: 1.25rem;
            padding-bottom: 1rem;
        }
    }
</style>
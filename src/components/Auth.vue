<template>
    <main class="container is-narrow is-fluid">
        <header class="section has-text-centered">
            <h1 v-if="showLoginForm" class="title t1">Sign in</h1>
            <h1 v-if="showSignUpForm" class="title t1">Get Started</h1>
            <h1 v-if="showResetPasswordForm" class="title t1">Reset Password</h1>
        </header>
        <form v-if="showLoginForm" onsubmit="event.preventDefault();" class="box is-large">
            <div class="field">
                <label class="label" for="email1">Email address</label>
                <div class="control is-clearfix" aria-required="true" aria-invalid="true">
                    <input type="text"
                           v-model.trim="loginForm.email"
                         autocomplete="on"
                         id="email1"
                         placeholder="you@email.com"
                         autocapitalize="off"
                         autocorrect="off"
                         name="email"
                         class="input">
                </div>
            </div>
            <div class="field">
                <label class="label" for="password1">Password</label>
                <div class="control is-clearfix" aria-required="true" aria-invalid="true">
                    <input v-model.trim="loginForm.password"
                            type="password"
                           autocomplete="on"
                           id="password1"
                           placeholder="Your password"
                           name="password"
                           class="input">
                </div>
            </div>

            <p class="help is-danger">{{errorMsg}}</p>

            <div class="field margin-top-lg">
                <div class="control">
                    <button v-if="performingRequest" class="button is-loading is-medium is-fullwidth">Sign in</button>
                    <button v-else @click="login" class="button is-primary is-medium is-fullwidth">Sign in</button>
                </div>
            </div>
            <div class="field margin-top-sm has-text-centered">
                <a @click="togglePasswordReset" class="t5">Forgot password?</a>
            </div>
            <div class="field has-text-centered">
                <a @click="toggleForm" class="t5">Create an Account</a>
            </div>
        </form>
        <form v-if="showSignUpForm" onsubmit="event.preventDefault();" class="box is-large">
            <div class="field">
                <label class="label" for="name">Name</label>
                <div class="control is-clearfix" aria-required="true" aria-invalid="true">
                    <input type="text"
                           v-model.trim="signupForm.name"
                           autocomplete="on"
                           id="name"
                           required="required"
                           placeholder="name"
                           autocapitalize="on"
                           autocorrect="off"
                           name="name"
                           class="input">
                </div>
            </div>
            <div class="field">
                <label class="label" for="email2">Email address</label>
                <div class="control is-clearfix" aria-required="true" aria-invalid="true">
                    <input type="text"
                           v-model.trim="signupForm.email"
                           autocomplete="on"
                           id="email2"
                           placeholder="you@email.com"
                           autocapitalize="off"
                           autocorrect="off"
                           name="email"
                           class="input">
                </div>
            </div>
            <div class="field">
                <label class="label" for="password2">Password</label>
                <div class="control is-clearfix" aria-required="true" aria-invalid="true">
                    <input v-model.trim="signupForm.password"
                           type="password"
                           autocomplete="on"
                           id="password2"
                           placeholder="min 6 characters"
                           name="password"
                           class="input">
                </div>
            </div>

            <p class="help is-danger">{{errorMsg}}</p>
            <div class="field margin-top-lg">
                <div class="control">
                    <button v-if="performingRequest" class="button is-loading is-medium is-fullwidth">Sign Up</button>
                    <button v-else @click="signup" class="button is-primary is-medium is-fullwidth">Sign Up</button>
                </div>
            </div>
            <div class="field has-text-centered">
                <a @click="toggleForm" class="t5">Back to Log In</a>
            </div>
        </form>
        <form v-if="showResetPasswordForm" onsubmit="event.preventDefault();" class="box is-large">
            <div v-if="!passwordResetSuccess">
                <div class="field">
                    <b-message>
                        We will send you an email to reset your password
                    </b-message>
                    <label class="label" for="email3">Email address</label>
                    <div class="control is-clearfix" aria-required="true" aria-invalid="true">
                        <input type="text"
                               v-model.trim="passwordForm.email"
                               autocomplete="on"
                               id="email3"
                               placeholder="you@email.com"
                               autocapitalize="off"
                               autocorrect="off"
                               name="email"
                               class="input">
                    </div>
                </div>
                <p class="help is-danger">{{errorMsg}}</p>
                <div class="field margin-top-lg">
                    <div class="control">
                        <button v-if="performingRequest" class="button is-loading is-medium is-fullwidth">
                            Submit
                        </button>
                        <button v-else @click="resetPassword" class="button is-primary is-medium is-fullwidth">
                            Submit
                        </button>
                    </div>
                </div>

                <div class="field has-text-centered">
                    <a @click="togglePasswordReset" class="t5">Back to Log In</a>
                </div>
            </div>
            <div v-else>
                <b-message type="is-info">
                    <h1><strong>Email Sent</strong></h1>
                    <div class="margin-top-sm">Check your email for a link to reset your password</div>
                </b-message>
                <div class="field has-text-centered">
                    <a @click="togglePasswordReset" class="t5">Back to Log In</a>
                </div>
            </div>
        </form>
    </main>
</template>

<script>
    const fb = require('../firebaseConfig.js')
    import {mapMutations} from 'vuex'

    export default {
        data() {
            return {
                loginForm: {
                    email: '',
                    password: ''
                },
                signupForm: {
                    name: '',
                    title: '',
                    email: '',
                    password: ''
                },
                passwordForm: {
                    email: ''
                },
                passwordResetSuccess: false,
                performingRequest: false,
                errorMsg: ''
            }
        },
        computed: {
            showLoginForm() {
                return this.action === 'login'
            },
            showSignUpForm() {
                return this.action === 'signup'
            },
            showResetPasswordForm() {
                return this.action === 'reset'
            },
        },
        props: {
            action: String
        },
        methods: {
            ...mapMutations([
                'setCurrentUser'
            ]),
            toggleForm() {
                this.errorMsg = ''
                this.$router.push(this.showLoginForm ? '/signup' : '/login')
            },
            login() {
                this.performingRequest = true
                this.errorMsg = ''
                fb.auth.signInWithEmailAndPassword(this.loginForm.email, this.loginForm.password).then(() => {
                    this.performingRequest = false
                    this.$router.push('/')
                }).catch(err => {
                    console.log(err)
                    this.performingRequest = false
                    this.errorMsg = err.message
                })
            },
            signup() {
                if (!this.signupForm.name) {
                    this.errorMsg = 'Please enter Name'
                    return
                }
                this.performingRequest = true
                this.errorMsg = ''
                let credential = fb.authObject.EmailAuthProvider.credential(this.signupForm.email, this.signupForm.password)
                fb.auth.currentUser.linkWithCredential(credential).then(user => {
                    this.setCurrentUser(user.user)
                    // create user obj
                    fb.usersCollection.doc(user.user.uid).set({
                        name: this.signupForm.name,
                        title: this.signupForm.title
                    }).then(() => {
                        this.$store.dispatch('fetchUserProfile')
                        this.performingRequest = false
                        this.$router.push('/')
                    }).catch(err => {
                        console.log(err)
                        this.performingRequest = false
                        this.errorMsg = err.message
                    })
                }).catch(err => {
                    console.log(err)
                    this.performingRequest = false
                    this.errorMsg = err.message
                })
            },
            togglePasswordReset() {
                this.errorMsg = ''
                this.passwordResetSuccess = false
                this.$router.push(this.showResetPasswordForm ? '/login' : '/resetpassword')
            },
            resetPassword() {
                this.performingRequest = true
                this.errorMsg = ''

                fb.auth.sendPasswordResetEmail(this.passwordForm.email).then(() => {
                    this.performingRequest = false
                    this.passwordResetSuccess = true
                    this.passwordForm.email = ''
                }).catch(err => {
                    console.log(err)
                    this.performingRequest = false
                    this.errorMsg = err.message
                })
            }
        }
    }
</script>

<style lang="scss">
    .box.is-large {
        padding: 1.5rem 3rem;
    }
    @media (max-width: 639px) {
        .box.is-large {
            padding: .75rem 1.5rem;
        }
    }
    .margin-top-lg {
        margin-top: 1.75rem!important;
    }
    .field:not(:last-child) {
        margin-bottom: 1rem;
    }
    .margin-top-sm {
        margin-top: 1.25rem!important;
    }
</style>
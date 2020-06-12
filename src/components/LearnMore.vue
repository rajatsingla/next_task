<template>
    <div>
        <main class="container">
            <div class="title learn-more-title is-capitalized">
                Learn More
            </div>
            <p class="learn-more-content">
                Hello, this is a simple utility tool to manage tasks according to priority.
                You can create boards and add multiple tasks on each board.
                See for yourself how it manages priority.
                <br/>
                <br/>
                <b>I can think of some use cases, such as</b>
            </p>
            <ul>
                <li>
                    <b>1.</b> To manage movie recommendations from friends,
                    in free time just watch the movie on top.
                    <br/>
                    <b>2.</b> Manage project tasks and focus on the task with highest priority.
                </li>
            </ul>
            <br/>
            <div>
                Source code: <a href="https://github.com/rajatsingla/next_task" target="_blank">Github</a>
            </div>
            <br/>
            <br/>
            <div class="learn-more-content">
                <h1 class="title"> Feedback/Contact </h1>

                <b-field label="Email">
                    <b-input type="email"
                             v-model="email"
                             maxlength="30">
                    </b-input>
                </b-field>

                <b-field label="Message">
                    <b-input maxlength="200" v-model="content" type="textarea"></b-input>
                </b-field>
                <div class="has-text-danger" v-if="error">
                    {{error}}
                </div>
                <div class="has-text-success" v-if="successMessage">
                    {{successMessage}}
                </div>
                <button @click="send" class="button is-primary">Send</button>
            </div>
        </main>
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    const fb = require('../firebaseConfig.js')

    export default {
        data () {
            return {
                email: '',
                content: '',
                error: '',
                successMessage: ''
            }
        },
        created () {
          this.email = this.currentUser.email
        },
        computed: {
            ...mapState(['currentUser'])
        },
        methods: {
            clearForm () {
                this.email = this.currentUser.email,
                this.content = ''
            },
            send () {
                this.error = ''
                this.successMessage = ''
                if (!this.email) {
                    this.error = "Please enter Email."
                    return false
                } else if (!this.content) {
                    this.error = "Please enter some Message."
                    return false
                }

                var self = this

                fb.feedbackCollection.add({
                    email: this.email,
                    content: this.content
                }).then(function(docRef) {
                    self.successMessage = "Thank you, submitted successfully."
                    self.clearForm()
                    console.log("Document written with ID: ", docRef.id);
                })
                .catch(function(error) {
                    self.error = "Please refresh and try again. " + error
                    console.error("Error adding document: ", error);
                });
            }
        }
    }
</script>

<style lang="scss">
    .learn-more-title {
        padding-top: 2rem;
    }
    @media (max-width: 480px) {
        .learn-more-title {
            padding-top: 1rem;
        }
    }
    .learn-more-content {
        max-width: 600px;
    }
</style>

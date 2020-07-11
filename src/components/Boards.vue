<template>
    <div>
        <div class="search-container" v-if="boards.length>1">
            <b-input placeholder="Search..."
                     v-model="search"
                     type="search"
            >
            </b-input>
        </div>
        <div class="columns is-multiline board-container">
            <div class="column is-one-quarter-desktop is-half-tablet">
                <div class="board-card" :style="getBackgroundColour()">
                    <div class="card-content">
                        <b-field label="Add new Board" class="no-error-msg">
                            <div class="control is-clearfix">
                                <input type="text"
                                       v-on:keyup.enter="createBoard()"
                                       v-model.trim="boardForm.name"
                                       autocomplete="on"
                                       required="required"
                                       placeholder="Books"
                                       class="input"
                                       v-bind:class="{ 'is-danger': addingBoardError }">
                            </div>
                        </b-field>
                        <div class="has-text-right">
                            <b-button @click="createBoard()" class="is-primary"
                                      v-bind:class="{ 'is-loading': addingBoard }">
                                Add
                            </b-button>
                        </div>
                    </div>
                </div>
            </div>
            <router-link
                    :to="{ name: 'board', params: { name: board.name }}" v-for="board in boardsFiltered"
                    :key="board.name"
                    class="column is-one-quarter-desktop is-half-tablet">
                <div class="board-card" :style="getBackgroundColour()">
                    <div class="card-content">
                        <p class="subtitle is-6 is-capitalized has-text-grey-darker">
                            {{board.name}}
                        </p>
                        <div class="subtitle is-5">
                            <div v-if="board.priority && board.priority.length" class="has-text-primary">
                                Priority task: {{getTopTask(board)}}
                            </div>
                            <div v-else class="has-text-grey-light">
                                No tasks on this board.
                            </div>
                        </div>
                        <div class="has-text-right">
                            <b-button type="is-text">Add Task</b-button>
                        </div>
                    </div>
                </div>
            </router-link>
        </div>
    </div>
</template>
<script>
    const fb = require('../firebaseConfig.js')
    import { mapState, mapActions, mapGetters } from 'vuex'
    import { getBackgroundColour } from './utils'

    export default {
        computed: {
            ...mapState(['boards', 'currentUser', 'tasks']),
            ...mapGetters(['tasksObj']),
            boardsFiltered: function () {
                if (this.search) {
                    return this.boards.filter((board) => {
                        return board.name.toLowerCase().includes(this.search.toLowerCase())
                    })
                } else {
                    return this.boards
                }
            }
        },
        created() {
            this.bindBoards(this.getOrderedBoardRef())
            this.bindTasks(this.getTaskRef())
        },
        data() {
            return {
                addingBoard: false,
                addingBoardError: false,
                boardForm: {
                    name: ''
                },
                search: ''
            }
        },
        methods: {
            ...mapActions(['bindBoards', 'bindTasks']),
            getBackgroundColour () {
              return getBackgroundColour()
            },
            getOrderedBoardRef () {
                return fb.usersCollection.doc(this.currentUser.uid).collection('boards').orderBy('createdAt', 'desc')
            },
            getBoardRef () {
                return fb.usersCollection.doc(this.currentUser.uid).collection('boards')
            },
            getTaskRef () {
                return fb.usersCollection.doc(this.currentUser.uid).collection('tasks')
            },
            createBoard () {
                this.addingBoardError = false
                if (!this.boardForm.name) {
                    this.addingBoardError = true
                    return
                }
                this.addingBoard = true
                this.getBoardRef().doc(this.boardForm.name).set({
                    name: this.boardForm.name,
                    createdAt: Date.now(),
                    priority: []
                }).then(() => {
                    this.boardForm = {
                        name: ''
                    }
                    this.addingBoard = false
                    this.$buefy.toast.open('Board added')
                    console.log('board added')
                }).catch(err => {
                    this.addingBoard = false
                    console.log(err)
                })
            },
            getTopTask: function (board) {
                // watching this.tasks.length to make sure bindTasks promise is resolved
                if (board.priority.length && this.tasks.length) {
                    return this.tasksObj[board.priority[0]].task
                } else {
                    return ""
                }
            }
        }
    }
</script>

<style lang="scss">
    .no-error-msg .help {
        display: none;
    }
    @media (max-width: 480px) {
        .column.no-mobile-padding-vertical {
            padding-top: 0px;
            padding-bottom: 0px;
        }
    }
    @media (max-width: 767px) {
        div.card-content {
            padding: 1rem;
            .subtitle:not(:last-child) {
                margin-bottom: 1rem;
            }
        }
    }
    .columns.no-margin-bottom {
        margin-bottom: 0px!important;
    }
    .board-card {
        border-radius: 0.25rem;
        box-shadow: 0 12px 18px -18px rgba(0, 0, 0, 0.25);
    }
    .board-containers {
        margin-top: 0px!important;
    }
    .search-container {
        width: 180px;
        float: left;
    }
    .board-container {
        clear: both;
    }
</style>

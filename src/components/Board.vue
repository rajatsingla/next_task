<template>
    <div>
        <main class="container">
            <div class="board-back-icon">
                <router-link to="/" class="has-text-grey-light">
                    <i class="icon-left"></i>
                    Go to all Boards
                </router-link>
            </div>
            <div class="title board-title is-4 is-capitalized">
                {{currentBoard.name}}
            </div>
            <div class="columns">
                <div class="column is-half">
                    <div class="field">
                        <label class="label">
                            Add new Task
                        </label>
                        <div class="control is-clearfix">
                            <input type="text"
                                   v-on:keyup.enter="addTask"
                                   autocomplete="on"
                                   required="required"
                                   class="input"
                                   :disabled="addingTask"
                                   v-model="task"
                                   v-bind:class="{ 'is-danger': addingTaskError }"
                                   autofocus="autofocus">
                        </div>
                    </div>
                    <div class="has-text-right">
                        <b-button @click="addTask" class="is-primary"
                                  v-bind:class="{ 'is-loading': addingTask }">
                            Add task
                        </b-button>
                    </div>
                </div>
            </div>

            <div v-if="addingTask" class="card choose-task-card">
                <h1 class="title is-6 has-text-danger">Please select the task that has greater priority</h1>
                <div class="choose-task-button">
                    <b-button @click="selectTask(task1)"
                              size="is-medium"
                              class="text-wrap">
                        {{task1}}
                    </b-button>
                </div>
                <div class="choose-task-button">
                    <b-button @click="selectTask(task2)"
                              size="is-medium"
                              class="text-wrap">
                        {{task2}}
                    </b-button>
                </div>
            </div>


            <div class="content">
                <h4>
                    Task on Priority
                </h4>
                <div v-if="currentBoard.priority && currentBoard.priority.length" class="subtitle is-5 text-wrap has-text-primary">
                    {{getTopTask(currentBoard)}}
                    <div>
                        <b-button @click="deleteTask" type="is-success" size="is-small" class="margin-top-10">
                            Done
                        </b-button>
                    </div>
                </div>
                <div v-else class="has-text-grey-light subtitle is-4">
                    No tasks on this board.
                </div>
            </div>

            <button @click="openClearTasksModal" class="button is-danger margin-top-30">
                <span>Delete Board</span>
            </button>
            <b-modal :active.sync="isImageModalActive" class="delete-board-modal">
                <section class="hero">
                    <div class="hero-body">
                        <div class="container">
                            <h1 class="title has-text-danger is-4">
                                Delete Board
                            </h1>
                            <b-field label="Please enter board name">
                                <b-input v-model="deleteBoardName"
                                         :placeholder="currentBoard.name"
                                ></b-input>
                            </b-field>
                            <span class="has-text-danger" v-if="deleteBoardError">
                                {{deleteBoardError}}
                            </span>
                            <button @click="deleteBoard" class="button is-danger">Delete</button>
                        </div>
                    </div>
                </section>
            </b-modal>
        </main>
    </div>
</template>
<script>
    const fb = require('../firebaseConfig.js')
    import {mapState, mapActions, mapGetters} from 'vuex'

    export default {
        created() {
            this.fetchCurrentBoard(this.getBoardDocRef())
            this.bindTasks(this.getTaskRef())
        },
        data() {
            return {
                task: '',
                addingTask: false,
                addingTaskError: false,
                task1: '',
                task2: '',
                boardName: this.$route.params.name,
                answersMap: {},
                open: false,
                isImageModalActive: false,
                deleteBoardName: '',
                deleteBoardError: '',
            }
        },
        computed: {
            ...mapState(['currentUser', 'currentBoard', 'tasks']),
            ...mapGetters(['tasksObj']),
        },
        methods: {
            ...mapActions(['fetchCurrentBoard', 'bindTasks']),
            getBoardDocRef() {
                return fb.usersCollection.doc(this.currentUser.uid).collection('boards').doc(this.boardName)
            },
            getTaskRef () {
                return fb.usersCollection.doc(this.currentUser.uid).collection('tasks')
            },
            clearForm() {
                this.addingTask = false
                this.addingTaskError = false
                this.stopRecursion = false
                this.task = ''
                this.task1 = ''
                this.task2 = ''
                this.answersMap = {}
            },
            openClearTasksModal() {
                this.isImageModalActive = true
            },
            deleteBoard() {
                let self = this
                this.deleteBoardError = ''
                if (!this.deleteBoardName ||
                    this.deleteBoardName.toLowerCase() !== this.currentBoard.name.toLowerCase()) {
                    this.deleteBoardError = 'Please enter Board name'
                    return false
                }
                this.getBoardDocRef().delete().then(function() {
                    self.$buefy.toast.open('Board deleted')
                    console.log("Board deleted successfully!");
                }).catch(function(error) {
                    console.error("Error removing document: ", error);
                });
            },
            deleteTask() {
                let priority = this.currentBoard ? [...this.currentBoard.priority] : []
                let taskId = priority.shift()
                this.getBoardDocRef().update({priority: priority}).then(() => {
                    console.log('task deleted')
                }).catch(err => {
                    console.log(err)
                })
                if (taskId && this.tasksObj[taskId]) {
                    this.getTaskRef().doc(taskId).update({
                        status: "done",
                        updateDate: Date.now()
                    })
                    .catch(function(error) {
                        console.error("Error updating document: ", error);
                    });
                }
            },
            addTask() {
                this.addingTaskError = false
                if (!this.task) {
                    this.addingTaskError = true
                    return false
                }
                let tasks = this.getCurrentBoardTasks()
                let priority = this.currentBoard ? [...this.currentBoard.priority] : []
                let idx = tasks.length ? this.binarySearch(tasks, 0, tasks.length - 1, this.task) : -1
                let that = this

                if (idx !== "terminated") {
                    this.getTaskRef().add({
                        board: this.currentBoard.name,
                        createDate: Date.now(),
                        status: "pending",
                        task: this.task,
                        updateDate: Date.now()
                    })
                    .then(function(docRef) {
                        priority.splice(idx + 1, 0, docRef.id)
                        that.getBoardDocRef().update({priority: priority}).then(() => {
                            that.$buefy.toast.open('Task added')
                            console.log('task added')
                        }).catch(err => {
                            console.log(err)
                        })
                    })
                    .catch(function(error) {
                        console.error("Error adding document: ", error);
                    });
                    this.clearForm()
                }
            },
            getCurrentBoardTasks() {
                let tasks = []
                for (let i = 0; i < this.currentBoard.priority.length; i++) {
                    tasks.push(this.tasksObj[this.currentBoard.priority[i]].task)
                }
                return tasks
            },
            binarySearch(tasks, low, high, key) {
                if (this.stopRecursion) {
                    return "terminated"
                }
                let mid = Math.floor((low + high) / 2)
                if (high < low) {
                    return mid
                }

                let answer = this.answersMap[key + tasks[mid]] || this.answersMap[tasks[mid] + key]
                if (answer) {
                    if (answer === tasks[mid]) {
                        return this.binarySearch(tasks, (mid + 1), high, key)
                    }
                } else {
                    this.addingTask = true
                    this.task1 = key
                    this.task2 = tasks[mid]
                    this.stopRecursion = true
                    return "terminated"
                }
                return this.binarySearch(tasks, low, (mid - 1), key)
            },
            selectTask(selectedTask) {
                this.answersMap[this.task1 + this.task2] = selectedTask
                this.stopRecursion = false
                this.addTask()
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
    .board-back-icon {
        padding-top: 1rem;
        padding-bottom: 1rem;
    }

    @media (max-width: 480px) {
        .board-back-icon {
            padding-bottom: 0rem;
        }
    }

    .board-title {
        padding-top: 1rem;
    }

    .choose-task-button {
        padding-bottom: 15px;
    }

    .choose-task-card {
        margin-bottom: 20px;
        padding: 25px;
    }

    .margin-top-30 {
        margin-top: 30px;
    }

    .margin-top-10 {
        margin-top: 10px;
    }

    button.text-wrap {
        white-space: normal;
        height: auto;
    }

    @media screen and (min-width: 767px) {
        .text-wrap {
            max-width: 50%;
        }
    }

    .delete-board-modal.modal .modal-content {
        width: 300px;
        height: 300px;
        box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.19);
        background: white;
        border-radius: 10px;
    }

    .icon-left {
        border: solid;
        border-width: 0 4px 4px 0;
        display: inline-block;
        padding: 4px;
        transform: rotate(135deg);
        -webkit-transform: rotate(135deg);
    }
</style>

const fb = require('../firebaseConfig.js')
import { firestoreAction } from 'vuexfire'
import router from '../routes'

export default {
    fetchUserProfile({ commit, state }) {
        fb.usersCollection.doc(state.currentUser.uid).get().then(res => {
            commit('setUserProfile', res.data())
        }).catch(err => {
            console.log(err)
        })
    },
    clearData ({ commit }) {
        commit('setCurrentUser', null)
        commit('setUserProfile', {})
    },
    bindBoards: firestoreAction(({ bindFirestoreRef }, ref) => {
        return bindFirestoreRef('boards', ref)
    }),
    fetchCurrentBoard({ commit }, ref) {
        ref.onSnapshot(function(doc) {
            if (!doc.data()) {
                console.log("yo man")
                router.push('/')
            }
            commit('currentBoard', doc.data())
        });
    }
};

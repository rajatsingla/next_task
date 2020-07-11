import { vuexfireMutations } from 'vuexfire'

export default {
  ...vuexfireMutations,
  currentBoard(state, val) {
    state.currentBoard = val
  },
  setTasksBinded(state, val) {
    state.tasksBinded = val  
  },
  setCurrentUser(state, val) {
    if (val) {
      state.currentUser = {
        isAnonymous: val.isAnonymous,
        email: val.email,
        uid: val.uid
      }
    }
    else {
      state.currentUser = null
    }
  },
  setUserProfile(state, val) {
    if (val) {
      state.userProfile = {
        name: val.name,
        title: val.title
      }
    }
    else {
      state.userProfile = {}
    }
  }
};

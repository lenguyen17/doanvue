import Vuex from 'vuex'
import state from './state'
import actions from './action';
import mutations from './mutation';
import getters from './getter';
const store=new Vuex.Store({
    state,actions,mutations,getters
})
export default store
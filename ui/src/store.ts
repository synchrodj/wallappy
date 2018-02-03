import Vue from 'vue';
import Vuex from 'vuex';
import http from './services/http';

Vue.use(Vuex);

const UPDATE_DEPLOYMENTS = 'UPDATE_DEPLOYMENTS';

export default new Vuex.Store({
    state: {
        deployments: {}
    },
    mutations: {
        [UPDATE_DEPLOYMENTS] (state, deployments) {
            state.deployments = deployments;
            console.log('State update ' + UPDATE_DEPLOYMENTS + deployments); 
        }
    },
    getters: {
        deployments (state) {
            return state.deployments;
        }
    },
    actions: {
        getDeploymentsConfig ({commit}) {
            return http.get('/api/config/deployments')
                .then((response) => commit(UPDATE_DEPLOYMENTS, response.data));
        }
    }
});
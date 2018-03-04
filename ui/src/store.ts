import Vue from 'vue';
import Vuex from 'vuex';
import http from './services/http';

Vue.use(Vuex);

const UPDATE_DEPLOYMENTS = 'UPDATE_DEPLOYMENTS';

export default new Vuex.Store({
    state: {
        deployments: []
    },
    mutations: {
        [UPDATE_DEPLOYMENTS] (state, deployments) {
            state.deployments = deployments;
        }
    },
    getters: {
        deployments (state) {
            return state.deployments;
        }
    },
    actions: {
        getDeployments ({commit}) {
            return http.get('/api/deployments')
            .then((response) => {
                commit(UPDATE_DEPLOYMENTS, response.data);
            });
        }
    }
});
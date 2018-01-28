import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    envs: [
      {
        name: 'Development',
        type: 'development',
        shortType: 'dev'
      },
      {
        name: 'Integration',
        type: 'integration',
        shortType: 'int'
      },
      {
        name: 'Performance',
        type: 'performance',
        shortType: 'perf'
      },
      {
        name: 'Production',
        type: 'production',
        shortType: 'prod'
      },
      {
        name: 'DEV',
        type: 'development',
        shortType: 'dev'
      },
      {
        name: 'INT',
        type: 'integration',
        shortType: 'int'
      },
      {
        name: 'PROD',
        type: 'production',
        shortType: 'prod'
      },

    ],
    profileResolver: {
      type: 'confluence'
    },
    cdResolver: {
      type: 'bamboo',
      applicationPath: 'https://bamboo.env/{APP_NAME}'
    }
};

export default new Vuex.Store({
    state: state
});
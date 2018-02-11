import Vue from 'vue';
import VueRouter from 'vue-router';
import { makeHot, reload } from './util/hot-reload';
import { createRouter } from './router';


const navbarComponent = () => import('./components/navbar').then(({ NavbarComponent }) => NavbarComponent);

import './sass/main.scss';

import  'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon.vue';
Vue.component('icon', Icon);

import ElementUI from 'element-ui';
Vue.use(ElementUI);

import Element from 'element-ui';
Vue.use(Element);



import store from './store';

import { Env } from './components/env/env';
Vue.component('env', Env);

import { DeploymentCard } from './components/deployment-card/deployment-card';
Vue.component('deployment-card', DeploymentCard);

import { BuildCard } from './components/build-card/build-card';
Vue.component('build-card', BuildCard);

import { CDPipeCard } from './components/cd-pipe-card/cd-pipe-card';
Vue.component('cd-pipe-card', CDPipeCard);

new Vue({
    el: '#app-main',
    router: createRouter(),
    components: {
        'navbar': navbarComponent
    },
    store: store,
    created () {
        this.$store.dispatch('getDeploymentsConfig');
    }
});

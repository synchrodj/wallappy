import Vue from 'vue';
import VueRouter, { Location, Route, RouteConfig } from 'vue-router';
import { makeHot, reload } from './util/hot-reload';
import { DeploymentsComponent } from './components/deployments/deployments';

const homeComponent = () => import('./components/home').then(({ HomeComponent }) => HomeComponent);
const aboutComponent = () => import('./components/about').then(({ AboutComponent }) => AboutComponent);
const podsComponent = () => import('./components/pods').then(({ PodsComponent }) => PodsComponent);
const appWallboardComponent = () => import('./components/appwallboard').then(({ AppWallboardComponent }) => AppWallboardComponent);
const deploymentsComponent = () => import('./components/deployments').then(({ DeploymentsComponent }) => DeploymentsComponent);


if (process.env.ENV === 'development' && module.hot) {
  const homeModuleId = './components/home';
  const aboutModuleId = './components/about';
  const podsModuleId = './components/pods';
  const appWallboardModuleId = './components/appwallboard';
  const deploymentsModuleId = './components/deployments';

  // first arguments for `module.hot.accept` and `require` methods have to be static strings
  // see https://github.com/webpack/webpack/issues/5668
  makeHot(homeModuleId, homeComponent,
    module.hot.accept('./components/home', () => reload(homeModuleId, (<any>require('./components/home')).HomeComponent)));

  makeHot(aboutModuleId, aboutComponent,
    module.hot.accept('./components/about', () => reload(aboutModuleId, (<any>require('./components/about')).AboutComponent)));

  makeHot(podsModuleId, podsComponent,
    module.hot.accept('./components/pods', () => reload(podsModuleId, (<any>require('./components/pods')).PodsComponent)));

  makeHot(appWallboardModuleId, appWallboardComponent,
      module.hot.accept('./components/appwallboard', () => reload(appWallboardModuleId, (<any>require('./components/appwallboard')).AppWallboardComponent)));

  makeHot(deploymentsModuleId, deploymentsComponent,
    module.hot.accept('./components/appwallboard', () => reload(deploymentsModuleId, (<any>require('./components/deployments')).DeploymentsComponent)));
}

Vue.use(VueRouter);

export const createRoutes: () => RouteConfig[] = () => [
  {
    path: '/',
    component: homeComponent,
  },
  {
    path: '/about',
    component: aboutComponent,
  },
  {
    path: '/pods',
    component: podsComponent,
  },
  {
    path: '/deployments',
    component: deploymentsComponent,
  },
  {
    path: '/wallboard/pods/:pod/apps/:appid',
    component: appWallboardComponent,
  }
];

export const createRouter = () => new VueRouter({ mode: 'history', routes: createRoutes() });

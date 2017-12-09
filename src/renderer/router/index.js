import Vue from 'vue';
import Router from 'vue-router';
// import Layout from '@/componts/Layout';
Vue.use(Router);

export default new Router({
  routes: [{
    path: '/',
    name: 'Home',
    component: require('@/components/Layout').default,
    redirect: '/downlads',
    children: [{
      path: 'downlads', name: 'Downloads', component: require('@/views/Downloads').default,
    }],
  }, {
    path: '*', redirect: '/',
  }],
});

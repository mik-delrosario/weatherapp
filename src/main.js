// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/*import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false*/

/* eslint-disable no-new */
/*new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
*/

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import App from './App'
import Weather from './components/Weather'

Vue.use(VueResource)
Vue.use(VueRouter)

Vue.config.productionTip = false
console.log(__dirname+"/");
const router = new VueRouter({
	mode: 'history',
	base: 'localhost:8080',
	routes: [
		{path:'/', name: "mainpage", component: Weather},
		{path:'/search/:keyword', name: "search", component: Weather},
		{path:'/weather/:woeid', name: "weather", component: Weather}
	]
});

/* eslint-disable no-new */
/*new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})*/
new Vue({
	el: '#app',
  	components: { App },
	router,
	template: `
		<div id="app">
			<router-view></router-view>
		</div>
	`,
}).$mount('#app')

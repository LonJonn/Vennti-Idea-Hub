import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import IdeasList from "./views/IdeasList.vue";

import store from "./store";

Vue.use(Router);

const router = new Router({
	mode: "history",
	base: process.env.BASE_URL,
	routes: [
		{
			path: "/",
			name: "home",
			component: Home
		},
		{
			path: "/ideas",
			name: "ideasList",
			component: IdeasList,
			meta: { requiresAuth: true }
		},
		{
			path: "*",
			name: "404"
		}
	]
});

router.beforeEach((to, from, next) => {
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

	if (requiresAuth && !store.getters.isAuthed) {
		alert("auth required!");
		router.push("/");
	} else {
		next();
	}
});

export default router;

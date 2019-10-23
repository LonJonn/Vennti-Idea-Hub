import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import About from "./views/About.vue";

import { auth } from "@/firebase";

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
			path: "/about",
			name: "about",
			component: About,
			meta: {
				requiresAuth: true
			}
		},
		{
			path: "*",
			name: "404"
		}
	]
});

router.beforeEach((to, from, next) => {
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

	if (requiresAuth && !auth.currentUser) {
		alert("auth required!");
		router.push("/");
	} else {
		next();
	}
});

export default router;

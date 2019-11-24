import Vue from "vue";
import Router from "vue-router";

import { auth, authProviders } from "@/firebase";

Vue.use(Router);

const router = new Router({
	mode: "history",
	base: process.env.BASE_URL,
	routes: [
		{
			path: "/",
			name: "home",
			component: () => import("./views/Home.vue")
		},
		{
			path: "/ideas",
			name: "ideas",
			component: () => import("./views/List.vue"),
			meta: {
				requiresAuth: true
			}
		},
		{
			path: "/ideas/new",
			name: "create",
			component: () => import("./views/Create.vue"),
			meta: {
				requiresAuth: true
			}
		},
		{
			path: "/ideas/:ideaId",
			name: "details",
			component: () => import("./views/Details.vue"),
			props: true
		},
		{
			path: "/ideas/:ideaId/edit",
			name: "edit",
			component: () => import("./views/Edit.vue"),
			props: true
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
		auth.signInWithPopup(authProviders.google);
	} else {
		next();
	}
});

export default router;

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "@/assets/css/tailwind.css";

import { firestorePlugin } from "vuefire";
Vue.use(firestorePlugin);

import { auth } from "@/firebase";
auth.setPersistence("local");

const unsubscribe = auth.onAuthStateChanged(user => {
	if (user) store.commit("setUser", user);

	new Vue({
		router,
		store,
		render: h => h(App)
	}).$mount("#app");

	unsubscribe();
});

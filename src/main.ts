import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "@/assets/css/tailwind.css";
import { auth } from "@/firebase";

import { firestorePlugin } from "vuefire";
Vue.use(firestorePlugin);

auth.setPersistence("local");

import preloader from "@/assets/preloader";
document.getElementById("app").appendChild(preloader);

const unsubscribe = auth.onAuthStateChanged(() => {
	new Vue({
		router,
		store,
		render: h => h(App)
	}).$mount("#app");

	unsubscribe();
});

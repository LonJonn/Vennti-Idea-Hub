import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import "@/assets/css/tailwind.css";
import { db, auth } from "@/firebase";

import { firestorePlugin } from "vuefire";
Vue.use(firestorePlugin);

db.enablePersistence();
auth.setPersistence("local");

import preloader from "@/assets/preloader";
document.getElementById("app").appendChild(preloader);

const unsubscribe = auth.onAuthStateChanged(() => {
	new Vue({
		router,
		render: h => h(App)
	}).$mount("#app");

	unsubscribe();
});

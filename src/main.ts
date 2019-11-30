import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueMoment from "vue-moment";

import store from "@/store";

// Styles
import "@/assets/css/tailwind.css";
import "@/assets/css/global.css";

// Firebase
import { db, auth } from "@/firebase";

import { firestorePlugin } from "vuefire";
Vue.use(firestorePlugin);

db.enablePersistence();
auth.setPersistence("local");

// Loader
import preloader from "@/assets/preloader";
document.getElementById("app").appendChild(preloader);

// Global Components Registration
const requireComponent = require.context("./components/Base", false, /\.vue$/);
for (const filename of requireComponent.keys()) {
	const componentConfig = requireComponent(filename);
	const componentName = `App${filename.substr(2, filename.length - 6)}`;
	Vue.component(componentName, componentConfig.default || componentConfig);
}

Vue.use(VueMoment);

const unsubscribe = auth.onAuthStateChanged(user => {
	store.commit("setUser", user);

	new Vue({
		router,
		store,
		render: h => h(App)
	}).$mount("#app");

	unsubscribe();
});

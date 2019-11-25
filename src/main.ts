import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import "@/assets/css/tailwind.css";
import { db, auth } from "@/firebase";

import { firestorePlugin } from "vuefire";
Vue.use(firestorePlugin);

import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
Vue.component("v-select", vSelect);

db.enablePersistence();
auth.setPersistence("local");

import preloader from "@/assets/preloader";
document.getElementById("app").appendChild(preloader);

const requireComponent = require.context("./components/Base", false, /\.vue$/);
for (const filename of requireComponent.keys()) {
	const componentConfig = requireComponent(filename);
	const componentName = `App${filename.substr(2, filename.length - 6)}`;
	Vue.component(componentName, componentConfig.default || componentConfig);
}

const unsubscribe = auth.onAuthStateChanged(() => {
	new Vue({
		router,
		render: h => h(App)
	}).$mount("#app");

	unsubscribe();
});

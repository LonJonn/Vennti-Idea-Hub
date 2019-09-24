import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "@/assets/css/tailwind.css";
import { auth } from "@/firebase";

auth.setPersistence("local");

import preloader from "@/assets/preloader";
import { User } from "@/models";
document.getElementById("app").appendChild(preloader);

const unsubscribe = auth.onAuthStateChanged(async authAccount => {
	if (authAccount) {
		const user = await new User(authAccount.uid).init();
		store.commit("setUser", { authAccount, user });
	}

	new Vue({
		router,
		store,
		render: h => h(App)
	}).$mount("#app");

	unsubscribe();
});

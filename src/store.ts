import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import { auth, authProviders, db } from "@/firebase";

interface State {
	user: firebase.User;
}

// Move to cloud function
async function register(user: firebase.User) {
	await db
		.collection("users")
		.doc(user.uid)
		.set({
			name: user.displayName,
			profileIcon: user.photoURL,
			skills: [],
			likeCount: 0,
			commentCount: 0,
			assigned: 0
		});
}

export default new Vuex.Store({
	state: {
		user: null
	} as State,

	mutations: {
		setUser(state, user) {
			state.user = user;
		},
		removeUser(state) {
			state.user = null;
		}
	},

	actions: {
		async signInAction({ commit }) {
			try {
				const res = await auth.signInWithPopup(authProviders.google);
				commit("setUser", res.user);

				if (res.additionalUserInfo.isNewUser) await register(res.user);
			} catch (error) {
				console.error(error);
				console.error("Sign in failed.");
				return;
			}
		},

		async signOutAction({ commit }) {
			await auth.signOut();
			commit("removeUser");
		}
	}
});

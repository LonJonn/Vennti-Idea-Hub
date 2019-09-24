import Vue from "vue";
import Vuex from "vuex";

import { auth } from "@/firebase";
import firebase from "firebase/app";

import { User } from "@/models";

interface State {
	authAccount: firebase.User;
	user: User;
}

Vue.use(Vuex);

const googleProvider = new firebase.auth.GoogleAuthProvider();

export default new Vuex.Store({
	state: {
		authAccount: null,
		user: null
	} as State,

	getters: {
		isAuthed: state => !!state.authAccount && !!state.user
	},

	mutations: {
		setUser(state, payload: State): void {
			state.authAccount = payload.authAccount;
			state.user = payload.user;
		},
		removeUser(state): void {
			state.authAccount = null;
			state.user = null;
		}
	},

	actions: {
		async signInAction({ commit }) {
			try {
				const res = await auth.signInWithPopup(googleProvider);

				// Create account for new users
				const user = await new User(res.user.uid).init();
				if (!user.data)
					user.data = {
						commentsCount: 0,
						name: res.user.displayName,
						skills: []
					};

				const payload: State = {
					authAccount: res.user,
					user
				};

				commit("setUser", payload);
			} catch (error) {
				// console.error("Sign in failed.");
				return;
			}
		},

		async signOutAction({ commit }) {
			await auth.signOut();
			commit("removeUser");
		}
	}
});

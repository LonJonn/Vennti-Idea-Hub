import Vue from "vue";
import Vuex from "vuex";

import firebase from "firebase/app";
import { auth } from "@/firebase";

import { User } from "@/models";

interface State {
	authAccount: firebase.User;
	currentUser: User;
}

Vue.use(Vuex);

const googleProvider = new firebase.auth.GoogleAuthProvider();

export default new Vuex.Store({
	state: {
		authAccount: null,
		currentUser: null
	} as State,

	getters: {
		isAuthed: state => !!state.authAccount && !!state.currentUser
	},

	mutations: {
		setUser(state, payload: State): void {
			state.authAccount = payload.authAccount;
			state.currentUser = payload.currentUser;
		},
		removeUser(state): void {
			state.authAccount = null;
			state.currentUser.unsubscribe();
			state.currentUser = null;
		}
	},

	actions: {
		async signInAction({ commit }) {
			try {
				const res = await auth.signInWithPopup(googleProvider);

				// Create account for new users
				const currentUser = await new User(res.user.uid).init();
				if (!currentUser.data)
					currentUser.data = {
						name: res.user.displayName,
						skills: []
					};

				const payload: State = {
					authAccount: res.user,
					currentUser
				};

				commit("setUser", payload);
			} catch (error) {
				alert("Sign in failed.");
				return;
			}
		},

		async signOutAction({ commit }) {
			await auth.signOut();
			commit("removeUser");
		}
	}
});

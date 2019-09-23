import Vue from "vue";
import Vuex from "vuex";

import { auth } from "@/firebase";
import firebase from "firebase/app";

import { User } from "@/models";

interface State {
	auth: {
		user: firebase.User;
		status: string;
		error: string;
	};
}

Vue.use(Vuex);

const googleProvider = new firebase.auth.GoogleAuthProvider();

export default new Vuex.Store({
	state: {
		auth: {
			user: null,
			status: null,
			error: null
		}
	} as State,

	getters: {
		userId: state => {
			if (!state.auth.user) return null;

			return state.auth.user.uid;
		},
		userInstance: state => {
			if (!state.auth.user) return null;

			return new User(state.auth.user.uid);
		},
		isAuthed: state => {
			return !!state.auth.user;
		}
	},

	mutations: {
		setUser(state, payload) {
			state.auth.user = payload;
		},
		removeUser(state) {
			state.auth.user = null;
		},
		setAuthStatus(state, payload) {
			state.auth.status = payload;
		},
		setAuthError(state, payload) {
			state.auth.error = payload;
		}
	},

	actions: {
		signInAction({ commit }) {
			auth.signInWithPopup(googleProvider)
				.then(res => {
					commit("setUser", res.user);
					commit("setAuthStatus", "success");
					commit("setAuthError", null);
				})
				.catch(err => {
					commit("setAuthStatus", "failure");
					commit("setAuthError", err.message);
				});
		},

		signOutAction({ commit }) {
			auth.signOut()
				.then(() => {
					commit("removeUser");
					commit("setAuthStatus", "success");
					commit("setAuthError", null);
				})
				.catch(err => {
					commit("setAuthStatus", "failure");
					commit("setAuthError", err.message);
				});
		}
	}
});

<template>
	<div>
		<button
			v-if="!user"
			@click="login()"
			class="bg-blue-500 text-white px-3 py-2 rounded-lg mt-2"
		>Login</button>
		<div v-else>
			<pre>ID: {{ user.uid }}</pre>
			<span>
				Name:
				<input v-model="user.displayName" class="border-blue-500 border rounded mr-2" />
			</span>
			<button
				:disabled="!displayNameHasChanged"
				@click="updateProfile()"
				class="bg-blue-400 disabled:bg-red-400 disabled:cursor-not-allowed"
			>Change</button>
			<br />
			<button @click="logout()" class="bg-orange-500 text-white px-3 py-2 rounded-lg mt-2">Logout</button>
			<button class="bg-red-500 text-white px-3 py-2 rounded-lg mt-2">DELETE</button>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { auth, authProviders, db } from "@/firebase";
import { clone } from "lodash";

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

@Component
export default class Home extends Vue {
	// State
	user = clone(auth.currentUser);
	currentName = this.user ? this.user.displayName : null; // Should be logged in, but for now check

	// Methods
	async login() {
		const res = await auth.signInWithPopup(authProviders.google);
		this.user = clone(res.user);
		this.currentName = this.user.displayName; // *

		if (res.additionalUserInfo.isNewUser) await register(res.user);
	}

	async logout() {
		auth.signOut();
		this.user = null;
	}

	async updateProfile() {
		const { currentUser } = auth;

		currentUser.updateProfile({ displayName: this.user.displayName });
		db.collection("users")
			.doc(currentUser.uid)
			.update({
				displayName: this.user.displayName
			});

		this.currentName = this.user.displayName;
	}

	// Computed
	get displayNameHasChanged() {
		return this.user.displayName !== this.currentName;
	}
}
</script>

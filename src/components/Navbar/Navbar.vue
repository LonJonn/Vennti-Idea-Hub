<template>
	<nav>
		<router-link to="/" tag="span" class="logo">Venntiboard</router-link>
		<div class="left">
			<router-link to="/ideas">Ideas</router-link>
			<router-link to="/ideas/new">Create</router-link>
		</div>
		<div class="right">
			<AppButton v-if="!user" @click.native="login()">Login</AppButton>
			<AppDropdown v-else :title="greeting" :right="true">
				<router-link to="/profile">Edit Profile</router-link>
				<router-link to="/settings">Settings</router-link>
				<hr />
				<a @click="logout()">Log out</a>
				<hr />
				<span>Version: 👺</span>
			</AppDropdown>
		</div>
	</nav>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as AppTypes from "@/typings";
import { auth, authProviders, db } from "@/firebase";

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
export default class NavbarComponent extends Vue {
	// State
	user = auth.currentUser;

	// Methods
	async login() {
		const res = await auth.signInWithPopup(authProviders.google);
		this.user = res.user;

		if (res.additionalUserInfo.isNewUser) await register(res.user);
	}

	logout() {
		auth.signOut();
		this.user = null;
		this.$router.push("/").catch(() => {});
	}

	// Computed
	get greeting() {
		return `Welcome, ${this.user.displayName.split(" ")[0]}`;
	}
}
</script>

<style lang="postcss" scoped>
nav {
	@apply flex fixed h-16 w-screen items-center px-4;
	@apply bg-white border-gray-200 border-b-2;
}

.logo {
	@apply relative mr-6;
	@apply font-bold text-2xl;
	@apply tracking-tighter cursor-pointer;
}

.logo::after {
	content: "";
	opacity: 70%;
	right: -1rem;
	bottom: 0;
	@apply absolute;
	@apply w-6 h-6;
	@apply bg-primary-500;
	@apply rounded-full;
}

.logo::before {
	content: "";
	opacity: 80%;
	right: -0.1rem;
	bottom: -0.2rem;
	@apply absolute;
	@apply w-4 h-4;
	@apply bg-primary-300;
	@apply rounded-full;
}

nav a.router-link-exact-active {
	@apply text-primary-500;
}

.left {
	@apply flex-grow;
}

.left > a {
	@apply mr-2;
}

.right > a {
	@apply ml-2;
}
</style>
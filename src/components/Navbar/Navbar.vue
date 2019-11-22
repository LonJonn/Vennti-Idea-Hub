<template>
	<nav>
		<span class="logo">Venntiboard</span>
		<div class="left">
			<router-link to="/">Home</router-link>
			<router-link to="/ideas">Ideas</router-link>
		</div>
		<div class="right">
			<AppButton v-if="!user" @click="login()">Login</AppButton>
			<AppDropdown :title="greeting" v-else :right="true">
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
import AppDropdown from "@/components/Base/Dropdown.vue";
import AppButton from "@/components/Base/Button.vue";

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

@Component({ components: { AppDropdown, AppButton } })
export default class NavbarComponent extends Vue {
	// State
	user = { ...auth.currentUser };

	// Methods
	async login() {
		const res = await auth.signInWithPopup(authProviders.google);
		this.user = res.user;

		if (res.additionalUserInfo.isNewUser) await register(res.user);
	}

	async logout() {
		auth.signOut();
		this.user = null;
		this.$router.push("/");
	}

	// Computed
	get greeting() {
		return `Welcome, ${this.user.displayName.split(" ")[0]}`;
	}
}
</script>

<style lang="postcss" scoped>
nav {
	@apply flex items-center w-screen max-w-6xl mx-auto p-5;
	@apply text-lg;
}

.logo {
	@apply relative mr-5;
	@apply font-bold text-3xl;
	@apply tracking-tighter;
}

.logo::after {
	content: "";
	opacity: 70%;
	right: -1rem;
	bottom: 0;
	@apply absolute;
	@apply w-6 h-6;
	@apply bg-orange-500;
	@apply rounded-full;
}

.logo::before {
	content: "";
	opacity: 80%;
	right: -0.1rem;
	bottom: -0.2rem;
	@apply absolute;
	@apply w-4 h-4;
	@apply bg-orange-300;
	@apply rounded-full;
}

nav a.router-link-exact-active {
	@apply text-green-500;
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
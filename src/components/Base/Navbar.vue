<template>
	<nav>
		<router-link to="/" tag="span" class="logo">Venntiboard</router-link>
		<div class="left">
			<router-link to="/ideas">Ideas</router-link>
			<router-link to="/ideas/new">Create</router-link>
		</div>
		<div class="right">
			<AppButton v-if="!user" @click.native="signInAction()">Log in</AppButton>
			<AppDropdown v-else title="Menu" :right="true">
				<span class="font-semibold">Welcome, {{ this.user.displayName.split(" ")[0] }}</span>
				<hr />
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
import { State, Action } from "vuex-class";

@Component
export default class NavbarComponent extends Vue {
	// Store
	@State user: firebase.User;
	@Action signInAction: () => Promise<void>;
	@Action signOutAction: () => Promise<void>;

	async login() {
		await this.signInAction();
		this.$router.push((this.$route.query.redirect as string) || "/");
	}

	// Methods
	logout() {
		this.signOutAction();
		if (this.$route.name !== "home") this.$router.push("/");
	}
}
</script>

<style lang="postcss" scoped>
nav {
	@apply flex items-center pt-4 pb-12;
	@apply bg-white;
	@apply text-lg;
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
	@apply mr-4;
}

.right > a {
	@apply ml-2;
}
</style>
<template>
	<nav>
		<span class="logo">Venntiboard</span>
		<div class="left">
			<router-link to="/">Home</router-link>
			<router-link to="/ideas">Ideas</router-link>
		</div>
		<div class="right">
			<router-link to="/ideas/new">Create</router-link>
		</div>
	</nav>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as AppTypes from "@/typings";

@Component
export default class NavbarComponent extends Vue {
	// Props
	@Prop() idea: AppTypes.Idea;
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
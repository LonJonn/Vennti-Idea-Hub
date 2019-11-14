<template>
	<div id="app">
		<AppNavbar id="nav" />
		<router-view id="main" />
		<footer id="footer">Made by Lon XD</footer>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppNavbar from "@/components/Navbar/Navbar.vue";

@Component({ components: { AppNavbar } })
export default class App extends Vue {}
</script>

<style lang="postcss" scoped>
#app {
	@apply flex flex-col h-screen;
	@apply text-gray-900;
}

#main {
	@apply flex-grow mx-5 max-w-xl;
}

#footer {
	@apply py-4;
	@apply bg-gray-800 text-white;
	@apply text-center;
}
</style>
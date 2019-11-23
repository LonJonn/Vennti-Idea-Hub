<template>
	<div id="app">
		<AppNavbar id="nav" />
		<router-view id="main" class="w-full max-w-screen-xl mx-auto px-6 text-gray-900 pt-20" />
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppNavbar from "@/components/Navbar/Navbar.vue";

@Component({ components: { AppNavbar } })
export default class App extends Vue {}
</script>
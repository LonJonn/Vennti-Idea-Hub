<template>
	<div id="app" class="text-gray-900 w-full">
		<AppNavbar id="nav" />
		<div class="max-w-screen-xl mx-auto px-6 pt-20">
			<router-view id="main" />
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppNavbar from "@/components/Navbar/Navbar.vue";

@Component({ components: { AppNavbar } })
export default class App extends Vue {}
</script>
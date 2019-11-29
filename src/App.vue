<template>
	<div id="app" class="text-gray-900 w-full">
		<AppNavbar id="nav" />
		<div id="main" class="max-w-screen-xl mx-auto px-6 pt-24">
			<router-view class="container" />
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class App extends Vue {}
</script>
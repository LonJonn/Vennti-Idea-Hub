<template>
	<div id="app" class="container lg:max-w-5xl">
		<AppNavbar id="nav" />
		<router-view />
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class App extends Vue {}
</script>
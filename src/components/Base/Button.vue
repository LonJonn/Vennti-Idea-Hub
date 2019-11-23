<template>
	<button>
		<slot></slot>
	</button>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class ButtonComponent extends Vue {}
</script>

<style lang="postcss" scoped>
button {
	@apply px-3 py-1;
	@apply bg-gray-200;
	@apply rounded-lg;
	@apply cursor-pointer;

	transition-duration: 0.2s;
	transition-property: background-color, color;
	transition-timing-function: ease-in-out;
}

button:hover {
	@apply text-primary-500;
	@apply bg-primary-200;
}
</style>
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
	@apply rounded-lg;
}

button:hover {
	@apply text-green-600;
	@apply bg-green-100;
}
</style>
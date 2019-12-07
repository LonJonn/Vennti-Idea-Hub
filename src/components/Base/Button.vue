<template>
	<button :class="[{ round, center, full}, theme]">
		<slot></slot>
	</button>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class ButtonComponent extends Vue {
	@Prop() theme: "dark" | "light" | "outline" | "primary";
	@Prop({ type: Boolean }) round: boolean;
	@Prop({ type: Boolean }) center: boolean;
	@Prop({ type: Boolean }) full: boolean;
}
</script>

<style lang="postcss" scoped>
button {
	@apply px-3 py-1;
	@apply rounded-lg cursor-pointer;

	transition-duration: 0.2s;
	transition-property: background-color, color, border-color;
	transition-timing-function: ease-in-out;
}

button:active {
	transition: 0.1s ease-in-out filter;
	filter: saturate(0.5);
}

.round {
	@apply rounded-full;
}

.center {
	@apply block mx-auto;
}

.full {
	@apply w-full;
}

.light {
	@apply bg-gray-200;
}

.light:hover {
	@apply bg-primary-200 text-primary-500;
}

.dark {
	@apply bg-gray-800 text-white;
}

.dark:hover {
	@apply bg-gray-700;
}

.outline {
	@apply bg-white;
	@apply border border-gray-800;
}

.outline:hover {
	@apply text-primary-500;
	@apply border-primary-500;
}

.primary {
	@apply bg-primary-400 text-primary-900;
}

.primary:hover {
	@apply bg-primary-500 text-primary-100;
}
</style>
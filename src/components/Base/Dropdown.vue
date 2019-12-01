<template>
	<div id="dropdown">
		<div id="title" class="flex items-center">
			<span>{{ title }}</span>
			<svg
				class="h-6 ml-2 text-primary-500 fill-current"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
			>
				<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
			</svg>
		</div>
		<div id="menucontainer" :class="{ 'right-aligned': right }">
			<div id="dropmenu">
				<slot></slot>
			</div>
		</div>
	</div>
</template>



<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class DropdownComponent extends Vue {
	// Props
	@Prop() title: string;
	@Prop({ default: false }) right: boolean;
}
</script>

<style lang="postcss" scoped>
#dropdown {
	@apply relative z-50;
}

#menucontainer {
	@apply absolute;
	top: 100%;
	min-width: 10em;
}

.right-aligned {
	@apply text-right;
	right: 0;
}

#title {
	@apply px-3 py-1;
	@apply rounded-lg;

	transition-duration: 0.2s;
	transition-property: background-color, color;
	transition-timing-function: ease-in-out;
}

#dropmenu {
	@apply mt-2 flex flex-col;
	@apply bg-white;
	@apply rounded-lg shadow-full overflow-hidden;
	max-height: 0;

	transition-duration: 0.2s;
	transition-property: max-height, padding;
	transition-timing-function: ease-in-out;
}

hr {
	@apply my-2 py-0 !important;
	@apply border border-gray-200;
}

#dropmenu * {
	@apply px-4 py-1;
}

#dropdown:hover #dropmenu,
#dropdown:focus-within #dropmenu {
	@apply py-2;

	max-height: 100vh;
}

#dropdown:hover #title {
	@apply text-primary-600;
	@apply bg-primary-100;
}

a {
	@apply cursor-pointer;
}

#dropmenu a:hover {
	@apply text-primary-500 bg-primary-100;
}
</style>


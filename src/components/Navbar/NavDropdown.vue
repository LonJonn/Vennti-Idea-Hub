<template>
	<div id="dropdown">
		<div id="title" class="flex items-center">
			<span>{{ title }}</span>
			<svg
				class="h-6 ml-2 text-blue-500 fill-current"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
			>
				<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
			</svg>
		</div>
		<div id="menucontainer">
			<div id="dropmenu" :class="{ 'right-aligned': right }">
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
	@apply relative;
}

#menucontainer {
	@apply absolute;
	top: 100%;
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
	width: max-content;
	max-height: 0;

	transition-duration: 0.2s;
	transition-property: max-height, padding;
	transition-timing-function: ease-in-out;
}

.right-aligned {
	@apply text-right;
}

#dropdown:hover #dropmenu {
	@apply py-2;

	max-height: 10em;
}

#dropmenu * {
	@apply mx-4;
}

#dropmenu *:hover {
	@apply text-blue-500;
	width: max-content;
}

#dropdown:hover #title {
	@apply text-blue-600;
	@apply bg-blue-100;
}
</style>


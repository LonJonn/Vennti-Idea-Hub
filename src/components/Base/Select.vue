<template>
	<v-select :options="options"></v-select>
</template>



<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class SelectComponent extends Vue {
	// Props
	@Prop() options: string[];
}
</script>

<style lang="postcss">
.input.v-select * {
	border: none;
	margin: 0;
	padding: 0;
}

.input.v-select:focus-within {
	@apply bg-white border-primary-500;
}

.vs__dropdown-menu {
	margin-top: 2px !important;
}

.vs__dropdown-option--highlight {
	@apply bg-primary-200 text-primary-500 !important;
}

.vs__dropdown-option,
.vs__no-options {
	@apply py-2 px-3 !important;
}

.vs__no-options {
	@apply bg-red-200 text-red-500 !important;
}

.vs__open-indicator {
	@apply ml-3 !important;
}
</style>

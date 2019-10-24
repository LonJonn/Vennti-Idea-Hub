<template>
	<div class="mb-5">
		<div class="bg-gray-300 rounded text-blue-800 p-5">
			<li>Description: {{ idea.description }}</li>
			<li>Owner: {{ idea.owner.name }}</li>
			<router-link :to="'ideas/' + idea.id" class="button mt-12 bg-pink-500">Details</router-link>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as AppTypes from "@/models/typings";

@Component
export default class IdeaComponent extends Vue {
	// Props
	@Prop() idea: AppTypes.Idea;
}
</script>

<style lang="postcss" scoped>
.button {
	@apply text-lg text-white font-semibold px-6 py-1 rounded;
}
</style>
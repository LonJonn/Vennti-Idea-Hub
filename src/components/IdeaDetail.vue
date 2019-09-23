<template>
	<div class="mb-5">
		<span v-for="(value, key) in idea" :key="key">{{ key }}: {{ value }}</span>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Idea } from "../models";

@Component
export default class IdeaDetail extends Vue {
	@Prop() idea: Idea;

	description: string;
	benefit: string;

	createIdea() {
		const newIdea = new Idea();
		// asdasdasdasdasdsadasd
	}
}
</script>

<style lang="postcss" scoped>
</style>
<template>
	<div>
		<h1>Ideas</h1>
		<div class="search-bar">
			<input type="text" name="search" placeholder="Type to search" />
			<AppButton theme="light">Search</AppButton>
		</div>
		<div class="ideas-container">
			<AppIdea v-for="idea of ideas" :key="idea.id" :idea="idea" />
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppIdea from "@/components/List/Idea.vue";
import { db } from "@/firebase";
import { firestore } from "firebase/app";
import * as AppTypes from "@/typings";

@Component({
	components: { AppIdea },
	firestore: {
		ideas: db
			.collection("ideas")
			.orderBy("createdAt", "desc")
			.limit(10)
	}
})
export default class List extends Vue {
	// State
	ideas: AppTypes.Idea[] = [];
}
</script>

<style lang="postcss" scoped>
.search-bar {
	display: grid;
	grid-template-columns: 3fr 1fr;
	grid-gap: 2em;

	@apply mb-12;
}

.search-bar * {
	@apply py-3 px-6;
}

.search-bar input {
	@apply bg-gray-300;
	@apply rounded-xl border;

	transition-duration: 0.2s;
	transition-property: background-color, border;
	transition-timing-function: ease-in-out;
}

.search-bar input:focus {
	@apply bg-white;
	@apply border-primary-500;
}

.ideas-container {
	display: grid;
	grid-template-columns: 1fr;
	grid-gap: 2em;

	@apply mb-8;
}

@screen sm {
	.ideas-container {
		grid-template-columns: repeat(2, 1fr);
	}
}

@screen lg {
	.ideas-container {
		grid-template-columns: repeat(3, 1fr);
	}
}
</style>

<template>
	<div>
		<h1>Ideas</h1>
		<div class="search-bar">
			<input type="text" name="search" placeholder="Type to search" />
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
		ideas: db.collection("ideas").orderBy("createdAt", "desc")
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
	grid-template-columns: 1fr;
	grid-gap: 1em;

	@apply mb-12;
}

.search-bar input {
	@apply py-2 px-4;
	@apply bg-gray-200;
	@apply rounded border;

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
	grid-gap: 2.5em;

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

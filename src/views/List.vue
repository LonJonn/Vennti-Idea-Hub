<template>
	<div>
		<h1>Ideas</h1>
		<div class="search-bar">
			<input v-model="query" type="text" name="search" />
			<button @click="search()">Search</button>
		</div>
		<AppIdea v-for="idea of qIdeas" :key="idea.id" :idea="idea" />
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
		// .limit(10)
	}
})
export default class List extends Vue {
	// State
	ideas: AppTypes.Idea[] = [];
	query: string = "";

	// Methods
	search() {
		console.log("searched!", this.query);
	}

	get qIdeas() {
		const query = this.query.toLowerCase();

		return this.ideas.filter(idea => {
			return (
				idea.benefit.toLowerCase().includes(query) ||
				idea.difficulty.toLowerCase() === query ||
				idea.skillsRequired.map(skill => skill.toLowerCase()).includes(query) ||
				idea.owner.displayName.toLowerCase().includes(query)
			);
		});
	}
}
</script>

<style lang="postcss" scoped>
.search-bar {
	@apply flex mb-4;
	@apply rounded-md overflow-hidden;
}

.search-bar input {
	@apply flex-grow py-2 px-4;
	@apply text-lg font-light tracking-wide;
	@apply bg-gray-200 text-gray-700;
}

.search-bar button {
	@apply px-8 py-2;
	@apply bg-gray-400;
}
</style>

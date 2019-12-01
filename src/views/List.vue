<template>
	<div>
		<h1>Ideas</h1>
		<div class="search-bar">
			<input class="input" type="text" name="search" />
			<button>Search</button>
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
	@apply flex mb-10;
	@apply rounded-md;
}

.search-bar button {
	@apply px-8 py-2;
	@apply bg-gray-400;
}

.ideas-container {
	display: grid;
	grid-template-columns: 1fr;
	grid-gap: 2em;
	@apply mb-16;
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

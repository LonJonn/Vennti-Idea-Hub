<template>
	<div class="mb-5">
		<div class="list bg-gray-300 rounded text-blue-800 p-5">
			<li>description: {{ idea.description }}</li>
			<li>benefit: {{ idea.benefit }}</li>
			<li>skills required: {{ readableSkills }}</li>
			<li>opened: {{ idea.createdOn.toDate() }}</li>
			<li>likes: {{ idea.likesCount }}</li>
			<li>status: {{ readableStatus }}</li>
			<br />
			<li>Owner: {{ idea.owner.name }}</li>
			<!-- <button v-if="!userHasLiked" class="like" @click="idea.like()">Like</button> -->
			<!-- <button v-else class="like" @click="idea.unlike()">Unlike</button> -->
			<button class="close" @click="remove()">Delete</button>
			<!-- {{ recentLikes }} -->
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { db } from "@/firebase";
import * as AppTypes from "@/models/typings";

@Component
export default class IdeaComponent extends Vue {
	// Props
	@Prop() idea: AppTypes.Idea;

	// Methods
	remove() {
		db.collection("ideas")
			.doc(this.idea.id)
			.delete();
	}

	// // Hooks
	// async mounted() {
	// 	this.likes = await new Likes(this.idea.id).init();

	// 	this.loading = false;
	// }

	// // Methods
	// deleteIdea() {
	// 	if (confirm("Are you sure?")) {
	// 		this.idea.delete();
	// 	}
	// }

	// Computed
	get readableSkills() {
		return this.idea.skillsRequired.map(skill => AppTypes.Skill[skill]).join(", ") || "None";
	}

	get readableStatus() {
		return AppTypes.IdeaStatus[this.idea.status];
	}

	// get recentLikes() {
	// 	return this.likes.latest
	// 		.splice(0, 2)
	// 		.map(like => (like.ref.id === this.user.id ? "You" : like.name))
	// 		.join(", ");
	// }

	// get userHasLiked() {
	// 	return this.likes.ids.some(id => id === this.user.id);
	// }
}
</script>

<style lang="postcss" scoped>
.list > li {
	@apply capitalize;
}

.button {
	@apply text-lg text-white font-semibold px-6 py-1 rounded mt-2;
}

.like {
	@apply button;
	@apply bg-green-500;
}

.close {
	@apply button;
	@apply bg-red-400 float-right;
}
</style>
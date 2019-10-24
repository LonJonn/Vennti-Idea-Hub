<template>
	<div>
		<div v-if="loading">Loading...</div>
		<div v-else class="mb-5 list text-blue-800 p-5">
			<li>description: {{ idea.description }}</li>
			<li>benefit: {{ idea.benefit }}</li>
			<li>skills required: {{ readableSkills }}</li>
			<li>opened: {{ idea.createdAt.toDate() }}</li>
			<li>likes: {{ idea.likesCount }}</li>
			<li>status: {{ readableStatus }}</li>
			<br />
			<li>Owner: {{ idea.owner.name }}</li>
			<AppLikes :ideaId="idea.id" />
			<button class="close" @click="remove()">Delete</button>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AppLikes from "@/components/Details/Likes.vue";
import { db } from "@/firebase";
import * as AppTypes from "@/models/typings";

@Component({ components: { AppLikes } })
export default class Details extends Vue {
	// State
	idea: AppTypes.Idea = null;
	loading = true;

	// Hooks
	async mounted() {
		const { ideaId } = this.$route.params;
		await this.$bind("idea", db.collection("ideas").doc(ideaId));
		this.loading = false;
	}

	// Methods
	remove() {
		if (confirm("Are you sure?")) {
			db.collection("ideas")
				.doc(this.idea.id)
				.delete();

			this.$router.push("/ideas");
		}
	}

	// Computed
	get readableSkills() {
		return this.idea.skillsRequired.map(skill => AppTypes.Skill[skill]).join(", ") || "None";
	}

	get readableStatus() {
		return AppTypes.IdeaStatus[this.idea.status];
	}
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
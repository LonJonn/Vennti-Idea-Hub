<template>
	<div>
		<div v-if="loading">Loading...</div>
		<div v-else-if="idea" class="mb-5 list text-blue-800 p-5">
			<li>description: {{ idea.description }}</li>
			<li>benefit: {{ idea.benefit }}</li>
			<li>skills required: {{ idea.skillsRequired || "None" }}</li>
			<li>opened: {{ idea.createdAt.toDate() }}</li>
			<li>difficulty: {{ idea.difficulty }}</li>
			<li>status: {{ idea.status }}</li>
			<br />
			<button v-show="isOwner" class="button bg-red-500" @click="remove()">Delete</button>
			<router-link :to="'/ideas/' + idea.id" class="text-blue-500 float-right">Cancel</router-link>
		</div>
		<div v-else>No idea haha 😂</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { db, auth } from "@/firebase";
import { firestore } from "firebase/app";
import * as AppTypes from "@/typings";

@Component
export default class Edit extends Vue {
	// State
	loading = true;
	ref = db.collection("ideas").doc(this.$attrs.ideaId);
	idea: AppTypes.Idea = null;

	// Hooks
	async mounted() {
		await this.$bind("idea", this.ref);
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
	get isOwner() {
		return (auth.currentUser.uid = this.idea.owner.id);
	}
}
</script>

<style lang="postcss" scoped>
.button {
	@apply text-lg text-white font-semibold px-6 py-1 rounded mt-2;
}
</style>
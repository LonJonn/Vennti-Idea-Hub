<template>
	<div>
		<div v-if="loading">Loading...</div>
		<div v-else class="mb-5 list text-blue-800 p-5">
			<li>description: {{ idea.description }}</li>
			<li>benefit: {{ idea.benefit }}</li>
			<li>skills required: {{ idea.skillsRequired.join(", ") || "None" }}</li>
			<li>opened: {{ idea.createdAt.toDate() }}</li>
			<li>difficulty: {{ idea.difficulty }}</li>
			<li>status: {{ idea.status }}</li>
			<li>Owner: {{ idea.owner.displayName }}</li>
			<button v-if="!userIsAssigned" @click="assignUser()" class="text-orange-600 my-3">Work on this</button>
			<button v-else @click="unassignUser()" class="text-orange-600 my-3">GET ME OUT!!!</button>
			<br />
			<AppLikes :ideaId="idea.id" />
			<router-link to="edit" append class="text-blue-500 float-right">Edit</router-link>
			<AppComments :ideaId="idea.id" />
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AppLikes from "@/components/Details/Likes.vue";
import AppComments from "@/components/Details/Comments.vue";
import { db, auth } from "@/firebase";
import { firestore } from "firebase/app";
import * as AppTypes from "@/typings";

@Component({ components: { AppLikes, AppComments } })
export default class Details extends Vue {
	// State
	idea: AppTypes.Idea = null;
	ref = db.collection("ideas").doc(this.$attrs.ideaId);
	assigned: AppTypes.Assignment[] = [];
	loading = true;

	// Hooks
	async mounted() {
		await this.$bind("idea", this.ref);
		await this.$bind("assigned", this.ref.collection("assigned"));

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

	// Turn into function (Used in Likes.vue as well)
	async assignUser() {
		const assignmentRef = this.ref.collection("assigned").doc(auth.currentUser.uid);
		const newAssignment: AppTypes.Assignment = {
			owner: {
				id: auth.currentUser.uid,
				displayName: auth.currentUser.displayName,
				photoUrl: auth.currentUser.photoURL
			},
			createdAt: firestore.Timestamp.now()
		};

		await assignmentRef.set(newAssignment);
	}

	async unassignUser() {
		const assignmentRef = this.ref.collection("assigned").doc(auth.currentUser.uid);
		await assignmentRef.delete();
	}

	// Computed
	get userIsAssigned() {
		return this.assigned.some(assigment => assigment.owner.id === auth.currentUser.uid);
	}
}
</script>

<style lang="postcss" scoped>
.button {
	@apply text-lg text-white font-semibold px-6 py-1 rounded mt-2;
}
</style>
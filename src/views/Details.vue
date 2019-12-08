<template>
	<div>
		<div v-if="!idea">Loading...</div>
		<div v-else>
			<h1 class="capitalize flex items-center">
				New platform to make integrations easier
				<span class="code">VI201</span>
			</h1>
			<p class="font-semibold text-gray-900 mb-1">Value</p>
			<p
				class="py-5 px-6 rounded bg-green-200 border-l-8 border border-green-400 font-light mb-8 flex items-center"
			>
				<i class="fas fa-info-circle text-green-500 mr-6 text-3xl"></i>
				<span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio quod qui harum sit, vel odio hic illo assumenda iure tempore itaque fugiat alias laborum voluptas unde eum? Ducimus, error ratione!</span>
			</p>
			<progress class="w-full rounded-full" max="100" value="20"></progress>
			<br />
			<br />
			<div class="mb-5 list text-blue-800">
				<li>description: {{ idea.description }}</li>
				<li>value: {{ idea.value }}</li>
				<li>skills required: {{ idea.skillsRequired.join(", ") || "None" }}</li>
				<li>opened: {{ idea.createdAt.toDate() }}</li>
				<li>scale: {{ idea.scale }}</li>
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
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AppLikes from "@/components/Details/Likes.vue";
import AppComments from "@/components/Details/Comments.vue";
import { db, auth } from "@/firebase";
import { firestore } from "firebase/app";
import * as AppTypes from "@/typings";

const increment = firestore.FieldValue.increment(1);
const decrement = firestore.FieldValue.increment(-1);

@Component({ components: { AppLikes, AppComments } })
export default class Details extends Vue {
	// State
	idea: AppTypes.Idea = null;
	ref = db.collection("ideas").doc(this.$attrs.ideaId);
	assigned: AppTypes.Assignment[] = [];

	// Hooks
	async mounted() {
		await this.$bind("idea", this.ref);
		await this.$bind("assigned", this.ref.collection("assigned"));
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

		await db
			.batch()
			.set(assignmentRef, newAssignment)
			.update(this.ref, { assignedCount: increment })
			.commit();
	}

	async unassignUser() {
		const assignmentRef = this.ref.collection("assigned").doc(auth.currentUser.uid);

		await db
			.batch()
			.delete(assignmentRef)
			.update(this.ref, { assignedCount: decrement })
			.commit();
	}

	// Computed
	get userIsAssigned() {
		return this.assigned.some(assigment => assigment.owner.id === auth.currentUser.uid);
	}
}
</script>

<style lang="postcss" scoped>
.code {
	@apply inline-block px-3 py-1 ml-3;
	@apply text-sm bg-gray-300 text-gray-700 font-semibold;
	@apply rounded;
}
</style>
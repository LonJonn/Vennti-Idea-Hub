<template>
	<div>
		<div>Create</div>
		<div class="form">
			<input v-model="ideaForm.description" placeholder="description" type="text" />
			<input v-model="ideaForm.benefit" placeholder="benefit" type="text" />
			<input v-model="ideaForm.skillsRequired" placeholder="required skills" type="text" />
			<input v-model.number="ideaForm.timeEstimation[0]" placeholder="minimum hours" type="number" />
			<input v-model.number="ideaForm.timeEstimation[1]" placeholder="maximum hours" type="number" />
		</div>
		<button @click="add()" class="my-3 px-5 py-1 text-white bg-blue-500 rounded">Add</button>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { db, auth } from "@/firebase";
import { firestore } from "firebase/app";
import * as AppTypes from "@/typings";

@Component
export default class Create extends Vue {
	// State
	ideaForm: AppTypes.IdeaNew = {
		difficulty: "Medium",
		benefit: null,
		description: null,
		skillsRequired: [],
		timeEstimation: [null, null]
	};

	// Methods
	add() {
		// Check for negative or out of order range
		const validTimeRange =
			!this.ideaForm.timeEstimation.some(hours => hours < 0) &&
			this.ideaForm.timeEstimation[0] < this.ideaForm.timeEstimation[1];

		if (!validTimeRange) return alert("Invalid time estimation.");

		const newIdea: AppTypes.Idea = {
			...this.ideaForm,
			owner: {
				id: auth.currentUser.uid,
				displayName: auth.currentUser.displayName,
				photoUrl: auth.currentUser.photoURL
			},
			status: "Open",
			difficulty: "Medium",
			createdAt: firestore.Timestamp.now(),
			likesCount: 0,
			assignedCount: 0,
			commentCount: 0
		};

		db.collection("ideas").add(newIdea);

		this.$router.push("/ideas");
	}
}
</script>

<style lang="postcss" scoped>
.form > input {
	@apply mt-3 py-1 px-2 bg-gray-200 rounded block;
}
</style>

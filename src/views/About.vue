<template>
	<div>
		<div class="form">
			<input v-model="ideaForm.description" placeholder="description" type="text" />
			<input v-model="ideaForm.benefit" placeholder="benefit" type="text" />
			<input v-model="ideaForm.skillsRequired" placeholder="required skills" type="text" />
			<input v-model.number="ideaForm.timeEstimation[0]" placeholder="minimum hours" type="number" />
			<input v-model.number="ideaForm.timeEstimation[1]" placeholder="maximum hours" type="number" />
		</div>
		<button @click="add()" class="p-3 bg-blue-500 rounded">Add</button>
		<div v-for="idea of ideas" :key="idea.id">
			<ul>ID: {{ idea.id }}</ul>
			<ul>Benefit: {{ idea.benefit }}</ul>
			<ul>Description: {{ idea.description }}</ul>
			<ul>Description: {{ idea.createdOn.toDate() }}</ul>
			<button @click="remove(idea.id)" class="text-red-500">Delete</button>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppIdea from "@/components/Idea.vue";
import { db, auth } from "@/firebase";
import * as AppTypes from "@/models/typings";
import { firestore } from "firebase/app";

async function createIdea(newData: AppTypes.NewIdea) {
	// Check for negative or out of order range
	const validTimeRange =
		!newData.timeEstimation.some(hours => hours < 0) &&
		newData.timeEstimation[0] < newData.timeEstimation[1];

	if (!validTimeRange) throw new Error("Invalid time estimation.");

	await db.collection("ideas").add({
		...newData,
		owner: {
			id: auth.currentUser.uid,
			name: auth.currentUser.displayName
		},
		assigned: [],
		status: AppTypes.IdeaStatus.Open,
		createdOn: firestore.FieldValue.serverTimestamp(),
		likesCount: 0
	});
}

async function deleteIdea(id: string) {
	await db
		.collection("ideas")
		.doc(id)
		.delete();
}

@Component({
	components: { AppIdea },
	firestore: { ideas: db.collection("ideas").orderBy("createdOn", "desc") }
})
export default class About extends Vue {
	// State
	ideas: AppTypes.Idea[] = [];
	ideaForm: AppTypes.NewIdea = {
		benefit: null,
		description: null,
		skillsRequired: [],
		timeEstimation: [null, null]
	};

	// Methods
	add() {
		createIdea(this.ideaForm);
		this.ideaForm = {
			benefit: null,
			description: null,
			skillsRequired: [],
			timeEstimation: [null, null]
		};
	}

	remove(id: string) {
		deleteIdea(id);
	}
}
</script>

<style lang="postcss" scoped>
.form > input {
	@apply mt-3 py-1 px-2 bg-gray-200 rounded block;
}
</style>

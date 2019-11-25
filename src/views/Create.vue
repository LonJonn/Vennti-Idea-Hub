<template>
	<div class="container max-w-2xl">
		<h1 class="text-3xl font-bold mb-4">Create</h1>
		<form @submit.prevent>
			<label class="label">Benefit</label>
			<input
				v-model="ideaForm.benefit"
				class="input"
				type="text"
				placeholder="What does your idea contribute?"
			/>

			<label class="label">Description</label>
			<textarea
				v-model="ideaForm.description"
				class="input"
				rows="4"
				placeholder="A detailed explanation of your idea to convice others that it's something to get excited about!"
			/>

			<label class="label">Difficulty</label>
			<select v-model="ideaForm.difficulty" class="input">
				<option value="Easy">Easy</option>
				<option value="Medium">Medium</option>
				<option value="Hard">Hard</option>
			</select>

			<div class="hours">
				<div>
					<label class="label">Minimum Hours</label>
					<input
						v-model.number="ideaForm.timeEstimation[0]"
						placeholder="minimum hours"
						type="number"
						class="input"
					/>
				</div>
				<div>
					<label class="label">Maximum Hours</label>
					<input
						v-model.number="ideaForm.timeEstimation[1]"
						placeholder="minimum hours"
						type="number"
						class="input"
					/>
				</div>
			</div>
			<AppButton @click.native="add()">Add</AppButton>
		</form>
		<!-- <input v-model="ideaForm.skillsRequired" placeholder="required skills" type="text" /> -->
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
		difficulty: null,
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
button {
	@apply rounded-md mt-2 px-12 text-xl py-2 bg-green-300 text-green-700 w-full shadow-md;
}

button:hover {
	@apply bg-green-400 text-green-700 shadow-lg;
}

.label {
	@apply block mb-1;
	@apply text-gray-700;
	@apply text-xs font-bold tracking-wide uppercase;
}

.input {
	@apply appearance-none block w-full mb-8 px-4 py-3;
	@apply bg-gray-200 text-gray-700 border-gray-200;
	@apply rounded border leading-tight outline-none font-light tracking-wide;

	transition-duration: 0.2s;
	transition-property: background-color, color, box-shadow, border;
	transition-timing-function: ease-in-out;
}

select.input {
	height: 46px;
}

.input:focus {
	@apply bg-white border-primary-500 shadow-md;
}

.hours {
	@apply flex;
}

.hours > div {
	@apply flex-grow;
}

.hours > div:first-of-type {
	@apply mr-8;
}
</style>

<template>
	<div>
		<h1>Create</h1>
		<div class="flex items-start mb-16">
			<form @submit.prevent class="lg:mr-12 flex-grow">
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
						<input v-model.number="ideaForm.timeEstimation[0]" type="number" class="input" />
					</div>
					<div>
						<label class="label">Maximum Hours</label>
						<input v-model.number="ideaForm.timeEstimation[1]" type="number" class="input" />
					</div>
				</div>
				<AppButton @click.native="add()">Add</AppButton>
			</form>
			<div class="helper">
				<h2 class="mb-4">Make sure your idea is</h2>
				<ul>
					<li class="flex items-center">
						<div class="rounded-full fill-current text-green-600">
							<svg
								class="w-8 h-8"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="3"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
								<polyline points="22 4 12 14.01 9 11.01" />
							</svg>
						</div>
						<span class="text-gray-700 font-light text-2xl ml-4">Descriptive</span>
					</li>
					<li
						class="ml-12 text-gray-600 text-sm -mt-1 mb-8"
					>Make sure you thoroughly outline why your idea is great and why others would want to contribute!</li>
					<li class="flex items-center">
						<div class="rounded-full fill-current text-green-600">
							<svg
								class="w-8 h-8"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="3"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
								<polyline points="22 4 12 14.01 9 11.01" />
							</svg>
						</div>
						<span class="text-gray-700 font-light text-2xl ml-4">Unique</span>
					</li>
					<li
						class="ml-12 text-gray-600 text-sm -mt-1 mb-8"
					>Check to see if someone has already put a similar idea up</li>
					<li class="flex items-center">
						<div class="rounded-full fill-current text-green-600">
							<svg
								class="w-8 h-8"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="3"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
								<polyline points="22 4 12 14.01 9 11.01" />
							</svg>
						</div>
						<span class="text-gray-700 font-light text-2xl ml-4">Achievable</span>
					</li>
					<li
						class="ml-12 text-gray-600 text-sm -mt-1 mb-8"
					>Check to see if someone has already put a similar idea up</li>
				</ul>
			</div>
		</div>

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
	@apply rounded-md mt-2 px-12 text-2xl py-4 bg-green-300 text-green-700 w-full shadow-md;
}

button:hover {
	@apply bg-green-400 text-green-700 shadow-lg;
}

.input {
	@apply mb-8;
}

select.input {
	height: 46px;
}

.hours {
	@apply flex;
}

.hours > div {
	@apply w-full;
}

.hours > div:first-of-type {
	@apply mr-8;
}

.helper {
	@apply bg-gray-100 rounded-xl shadow-xl p-12 w-2/5 hidden overflow-hidden relative;
}

.helper > h2 {
	@apply font-extrabold text-2xl;
}

.helper::before {
	content: "";
	@apply absolute block h-24 w-24 rounded-full bg-gray-500 opacity-75;
	bottom: -1em;
	left: 3em;
}

.helper::after {
	content: "";
	@apply absolute block h-8 w-4/5 bg-gray-500 opacity-75;
	bottom: 1em;
	left: -5em;
	transform: rotate(30deg);
}

@screen lg {
	.helper {
		@apply block;
	}
}
</style>

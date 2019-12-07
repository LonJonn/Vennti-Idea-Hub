<template>
	<div>
		<h1>Create</h1>
		<div class="flex items-start mb-16">
			<form @submit.prevent class="lg:mr-12 flex-grow">
				<label class="label">Title</label>
				<input
					v-model="ideaForm.title"
					class="input"
					type="text"
					placeholder="A very breif description of your idea"
				/>

				<label class="label">Value</label>
				<input
					v-model="ideaForm.value"
					class="input"
					type="text"
					placeholder="What value does your idea bring?"
				/>

				<label class="label">Description</label>
				<textarea
					v-model="ideaForm.description"
					class="input"
					rows="4"
					placeholder="A detailed explanation of your idea to convice others that it's something to get excited about!"
				/>

				<hr class="mb-8 border-b" />

				<label class="label">Project Scale</label>
				<multiselect class="mb-8" v-model="ideaForm.scale" :options="['Small', 'Medium', 'Large']" />

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

				<label class="label">Skills required</label>
				<multiselect
					class="mb-8"
					v-model="ideaForm.skillsRequired"
					:options="skillsOptions"
					:multiple="true"
					placeholder="Type to search"
				>
					<span slot="noResult">Oops! No skills found. Try searching for something else.</span>
				</multiselect>

				<AppButton @click.native="add()" full>Add</AppButton>
			</form>
			<AppHelper />
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { db, auth } from "@/firebase";
import { firestore } from "firebase/app";
import * as AppTypes from "@/typings";

import Multiselect from "vue-multiselect";
import AppHelper from "@/components/Create/Helper.vue";

@Component({ components: { Multiselect, AppHelper } })
export default class Create extends Vue {
	// State
	ideaForm: AppTypes.IdeaNew = {
		title: null,
		scale: null,
		value: null,
		description: null,
		skillsRequired: [],
		timeEstimation: [null, null]
	};

	skillsOptions = ["Technical", "Business", "Project Manager", "DMP", "CDP"];

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
			likeCount: 0,
			assignedCount: 0,
			commentCount: 0,
			tracking: 0
		};

		db.collection("ideas").add(newIdea);

		this.$router.push("/ideas");
	}
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="postcss" scoped>
button {
	@apply mt-2 px-12 py-4 text-2xl;
	@apply text-green-700 bg-green-300;
	@apply rounded-md shadow-md;
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
</style>

<style lang="postcss">
.multiselect__single {
	@apply bg-gray-200;
}

.multiselect__tags {
	@apply bg-gray-200 text-gray-700 border-gray-200;
	@apply rounded border leading-tight outline-none text-base font-light tracking-wide;

	transition-duration: 0.2s;
	transition-property: background-color, color, border;
	transition-timing-function: ease-in-out;
}

.multiselect__option.multiselect__option--highlight.multiselect__option--selected,
.multiselect__option.multiselect__option--highlight.multiselect__option--selected::after {
	@apply bg-red-500;
}

.multiselect__placeholder {
	@apply ml-1 text-gray-500 font-light;
}

.multiselect__tags:focus-within {
	@apply bg-white border-primary-500;
}

.multiselect__tag,
.multiselect__option.multiselect__option--highlight,
.multiselect__option.multiselect__option--highlight::after {
	@apply bg-primary-400;
}

.multiselect__tag-icon {
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
}

.multiselect__tag-icon:hover {
	@apply bg-primary-500;
}

.multiselect__tag-icon::after {
	@apply text-primary-600;
}
</style>

<template>
	<div class="about" :class="[{ 'bg-gray-300': loading }]">
		<div class="inputs">
			<input v-model="ideaForm.description" placeholder="description" type="text" />
			<input v-model="ideaForm.benefit" placeholder="benefit" type="text" />
			<input v-model="ideaForm.skillsRequired" placeholder="required skills" type="text" />
			<input v-model.number="ideaForm.timeEstimation[0]" placeholder="minimum hours" type="number" />
			<input v-model.number="ideaForm.timeEstimation[1]" placeholder="maximum hours" type="number" />
		</div>
		<button @click="createIdea" class="bg-blue-500 text-white px-6 py-1 rounded mt-3 mb-6">Add</button>
		<AppIdea :idea="idea" v-for="idea in ideas" :key="idea.id" />
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppIdea from "@/components/Idea.vue";

import { User, Idea } from "@/models";
import { NewIdea } from "@/models/typings";

import { State } from "vuex-class";

import { firestore as fs } from "firebase/app";
import { db } from "../firebase";

@Component({
	components: { AppIdea }
})
export default class About extends Vue {
	// Mapped Store
	@State user: User;

	// Data
	unsubscribe: () => void;
	loading: boolean = true;
	ideas: Idea[] = null;
	ideaForm: NewIdea = {
		benefit: null,
		description: null,
		skillsRequired: [],
		timeEstimation: [null, null]
	};

	// Hooks
	async created() {
		this.unsubscribe = Idea.all.orderBy("createdOn", "desc").onSnapshot(ds => {
			this.ideas = Idea.fromCollection(ds);
			this.loading = false;
		});
	}

	destroyed() {
		this.unsubscribe();
	}

	// Methods
	createIdea() {
		this.ideaForm.description += ["😈", "🎃", "👻", "👺"][Math.floor(Math.random() * 4)].repeat(
			Math.floor(Math.random() * 3)
		);
		Idea.create(this.ideaForm)
			.then(() => {
				this.ideaForm = {
					benefit: null,
					description: null,
					skillsRequired: [],
					timeEstimation: [null, null]
				};
			})
			.catch(err => alert(err.message));
	}
}
</script>

<style lang="postcss" scoped>
.inputs > input {
	@apply mt-3 py-1 px-2 bg-gray-200 rounded block;
}
</style>
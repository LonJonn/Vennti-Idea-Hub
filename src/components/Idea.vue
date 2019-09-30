<template>
	<div class="mb-5">
		<div v-if="!loading && idea.data" class="list bg-gray-300 rounded text-blue-800 p-5">
			<li>description: {{ idea.data.description }}</li>
			<li>benefit: {{ idea.data.benefit }}</li>
			<li>skills required: {{ readableSkills }}</li>
			<li>opened: {{ idea.data.createdOn.toDate() }}</li>
			<li>likes: {{ idea.data.likesCount }}</li>
			<li>status: {{ readableStatus }}</li>
			<br />
			<li>Owner: {{ this.idea.data.owner.name }}</li>
			<button v-if="!userHasLiked" class="like" @click="idea.like()">Like</button>
			<button v-else class="like" @click="idea.unlike()">Unlike</button>
			<button class="close" @click="deleteIdea()">Delete</button>
			{{ recentLikes }}
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { User, Idea } from "@/models";
import { Skill, IdeaStatus, Like } from "@/models/typings";
import { State } from "vuex-class";
import { db } from "../firebase";
import Likes from "../models/Likes";

@Component
export default class IdeaComponent extends Vue {
	// Mapped Store
	@State user: User;

	// Props
	@Prop() idea: Idea;

	// Data
	loading: boolean = true;
	likes: Likes = null;

	// Hooks
	async mounted() {
		this.likes = await new Likes(this.idea.id).init();

		this.loading = false;
	}

	// Methods
	deleteIdea() {
		if (confirm("Are you sure?")) {
			this.idea.delete();
		}
	}

	// Computed
	get readableSkills() {
		return this.idea.data.skillsRequired.map(skill => Skill[skill]).join(", ");
	}

	get readableStatus() {
		return IdeaStatus[this.idea.data.status];
	}

	get recentLikes() {
		return this.likes.ids
			.reverse()
			.slice(0, 2)
			.map(id => this.likes.data[id].name)
			.join(", ");
	}

	get userHasLiked() {
		return this.likes.ids.some(id => id === this.user.id);
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
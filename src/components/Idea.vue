<template>
	<div class="mb-5">
		<div v-if="!loading" class="list bg-gray-300 rounded text-blue-800 p-5">
			<li>description: {{ idea.data.description }}</li>
			<li>benefit: {{ idea.data.benefit }}</li>
			<li>skills required: {{ readableSkills }}</li>
			<li>opened: {{ idea.data.createdOn.toDate() }}</li>
			<li>likes: {{ likesCount }}</li>
			<li>status: {{ readableStatus }}</li>
			<br />
			<li>Owner: {{ ownerName }}</li>
			<button v-if="!userHasLiked" class="like" @click="idea.like(0)">Like</button>
			<button v-else class="like" @click="idea.unlike()">Unlike</button>
			<button class="close" @click="deleteIdea()">Delete</button>
			{{ recentLikes }}
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { User, Idea } from "@/models";
import { Skill, IdeaStatus } from "@/models/typings";
import { State } from "vuex-class";

@Component
export default class IdeaComponent extends Vue {
	// Mapped Store
	@State user: User;

	// Props
	@Prop() idea: Idea;

	// Data
	loading: boolean = true;
	handlers: Array<() => void> = [];
	ownerName: string = null;

	likes$: () => void;
	recentLikes: string = null;
	likesCount: number = null;
	userHasLiked: boolean = null;

	// Hooks
	async mounted() {
		this.ownerName = this.idea.data.owner.name;
		this.loading = false;

		this.likes$ = this.idea.ref.collection("likes").onSnapshot(ds => {
			this.likesCount = ds.size;
			this.userHasLiked = ds.docs.some(likeDoc => likeDoc.id === this.user.id);

			this.recentLikes = ds.docs
				.slice(0, 3)
				.map(doc => doc.data().name)
				.toString();
		});
	}

	destroyed() {
		this.likes$();
	}

	// Methods
	deleteIdea() {
		this.idea.delete();
		this.$destroy();
	}

	// Computed
	get readableSkills() {
		return this.idea.data.skillsRequired.map(skill => Skill[skill]).toString();
	}

	get readableStatus() {
		return IdeaStatus[this.idea.data.status];
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
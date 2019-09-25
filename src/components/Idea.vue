<template>
	<div class="mb-5">
		<div v-if="!loading" class="list bg-gray-300 rounded text-blue-800 p-5">
			<li>description: {{ idea.data.description }}</li>
			<li>benefit: {{ idea.data.benefit }}</li>
			<li>skills required: {{ readableSkills }}</li>
			<li>opened: {{ idea.data.createdOn.toDate() }}</li>
			<li>likes: {{ idea.data.likes.length }}</li>
			<li>status: {{ readableStatus }}</li>
			<br />
			<li>Owner: {{ owner.data.name }}</li>
			<button v-if="!userHasLiked" class="like" @click="idea.like()">Like</button>
			<button v-else class="like" @click="idea.unlike()">Unlike</button>
			<button class="close" @click="deleteIdea()">Delete</button>
			{{ userHasLiked }}
			{{ readableLikes }}
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
	owner: User = null;
	readableLikes: string[] = null;

	// Hooks
	async created() {
		this.owner = await new User(this.idea.data.owner).init();
		this.loading = false;

		this.idea.ref.onSnapshot(async ds => {
			const likesProm = ds.data().likes.map(async ref => (await ref.get()).data().name);
			this.readableLikes = await Promise.all(likesProm);
		});
	}

	destroyed() {
		this.owner.unsubscribe();
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

	get userHasLiked() {
		return this.idea.data.likes.some(ref => ref.id === this.user.id);
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
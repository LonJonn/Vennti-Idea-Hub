<template>
	<div class="mb-5">
		<div class="list bg-gray-300 rounded text-blue-800 p-5">
			<li>description: {{ idea.data.description }}</li>
			<li>benefit: {{ idea.data.benefit }}</li>
			<li>skills required: {{ readableSkills }}</li>
			<li>opened: {{ idea.data.createdOn.toDate() }}</li>
			<li>likes: {{ idea.data.likes.length }}</li>
			<li>status: {{ readableStatus }}</li>
			<br />
			<li>Owner: {{ ownerName }}</li>
			<button class="like" @click="idea.like()">Like</button>
			<button class="like" @click="idea.unlike()">Unlike</button>
			<button class="close" @click="deleteIdea()">Delete</button>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { User, Idea } from "@/models";
import { Skill, IdeaStatus } from "@/models/typings";

@Component
export default class IdeaComponent extends Vue {
	// Props
	@Prop() idea: Idea;

	// Data
	owner: User = null;

	// Hooks
	async created() {
		this.owner = await new User(this.idea.data.owner).init();
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

	get ownerName() {
		return this.owner && this.owner.data ? this.owner.data.name : "Loading...";
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
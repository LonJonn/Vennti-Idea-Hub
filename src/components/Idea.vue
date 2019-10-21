<template>
	<div class="mb-5">
		<div class="list bg-gray-300 rounded text-blue-800 p-5">
			<li>description: {{ idea.data.description }}</li>
			<li>benefit: {{ idea.data.benefit }}</li>
			<li>skills required: {{ readableSkills }}</li>
			<li>opened: {{ idea.data.createdOn.toDate() }}</li>
			<li>status: {{ readableStatus }}</li>
			<li>Assigned: {{ idea.data.assignments.length }}</li>
			<button v-if="!userIsAssigned" class="like" @click="idea.assignUser()">assign</button>
			<button v-else class="like" @click="idea.unassignUser()">Unassign</button>
			<li>Owner: {{ idea.data.owner.name }}</li>
			<br />
			<li>Likes: {{ idea.data.likes.length }}</li>
			<button v-if="!userDidLike" class="like" @click="idea.addLike()">Like</button>
			<button v-else class="like" @click="idea.removeLike()">Unlike</button>
			<button class="close" @click="deleteIdea()">Delete</button>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AppLikes from "@/components/Likes.vue";
import { State } from "vuex-class";

import { User, Idea } from "@/models";
import { Skill, IdeaStatus } from "@/models/typings";

@Component({ components: { AppLikes } })
export default class IdeaComponent extends Vue {
	// Mapped Store
	@State user: User;

	// Props
	@Prop() idea: Idea;

	// Methods
	deleteIdea() {
		if (confirm("Are you sure?")) {
			this.idea.delete();
		}
	}

	// Computed
	get readableSkills() {
		return this.idea.data.skillsRequired.map(skillVal => Skill[skillVal]).join(", ");
	}

	get readableStatus() {
		return IdeaStatus[this.idea.data.status];
	}

	get userDidLike() {
		return this.idea.data.likes.some(userId => userId === this.user.id);
	}

	get userIsAssigned() {
		return this.idea.data.assignments.some(userId => userId === this.user.id);
	}
}
</script>

<style lang="postcss">
.list > li {
	@apply capitalize;
}

.app-button {
	@apply text-lg text-white font-semibold px-6 py-1 rounded mt-2;
}

.like {
	@apply app-button;
	@apply bg-green-500;
}

.close {
	@apply app-button;
	@apply bg-red-400;
	@apply float-right;
}
</style>
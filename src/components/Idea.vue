<template>
	<div class="mb-5">
		<div v-if="loading" class="text-xl font-bold bg-blue-500 text-white">loading</div>
		<div v-else-if="idea.data" class="list bg-gray-300 rounded text-blue-800 p-5">
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
			<button class="close" @click="idea.delete()">Delete</button>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { User, Idea } from "@/models";
import { Skill, IdeaStatus } from "@/models/typings";

@Component
export default class IdeaComponent extends Vue {
	@Prop() idea: Idea;

	loading: boolean = false;
	owner: User = null;

	async created() {
		this.owner = await new User(this.idea.data.owner).init();
	}

	get ownerName() {
		return this.owner ? this.owner.data.name : "Loading...";
	}

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
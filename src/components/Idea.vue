<template>
	<div class="mb-5">
		<div v-if="loading" class="text-xl font-bold bg-blue-500 text-white">loading</div>
		<div v-else class="list bg-gray-300 rounded text-blue-800 p-5">
			<li>description: {{ idea.data.description }}</li>
			<li>benefit: {{ idea.data.benefit }}</li>
			<li>skills required: {{ readableSkills }}</li>
			<li>opened: {{ idea.data.createdOn.toDate() }}</li>
			<li>likes: {{ idea.data.likes.length }}</li>
			<li>status: {{ readableStatus }}</li>
			<br />
			<li>Owner: {{ ownerName }}</li>
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

.close {
	@apply bg-red-400 text-white text-lg font-semibold px-6 py-1 rounded mt-2;
}
</style>
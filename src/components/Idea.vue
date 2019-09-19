<template>
	<div class="mb-5">
		<div v-if="loading" class="text-xl font-bold bg-blue-500 text-white">loading</div>
		<div v-else class="bg-green-300 flex flex-col">
			<pre>{{ idea.benefit }}</pre>
			{{ ownerName }}
			<button @click="idea.delete()">del</button>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { User, Idea } from "@/models";

@Component
export default class IdeaComponent extends Vue {
	@Prop() idea: Idea;

	loading: boolean = false;
	owner: User = null;

	async created() {
		this.owner = await this.idea.getOwner();
	}

	get ownerName() {
		return this.owner ? this.owner.name : null;
	}
}
</script>

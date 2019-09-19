<template>
	<div class="about" :class="[{ 'bg-gray-300': loading }]">
		<div class="inputs"></div>
		<AppIdea :idea="idea" v-for="(idea, idx) in ideas" :key="idx" />
		<button class="bg-yellow-400 rounded-lg px-3 py-2 m-3">Yeet</button>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppIdea from "@/components/Idea.vue";

import { mapGetters } from "vuex";

import { User, Idea } from "@/models";
import { db, auth } from "../firebase";

@Component({
	components: { AppIdea },
	computed: mapGetters(["userInstance"])
})
export default class About extends Vue {
	// Mapped Getters
	userInstance: User;

	// Data
	loading: boolean = true;
	ideas: Idea[] = null;

	// Hooks
	async created() {
		Idea.all
			.where("owner", "==", this.userInstance.ref)
			.orderBy("createdOn", "desc")
			.onSnapshot(ds => {
				this.ideas = Idea.collection(ds);
			});

		const me = await new User(auth.currentUser.uid).fetch();
		this.loading = false;
	}
}
</script>

<style lang="postcss" scoped>
.inputs > input {
	@apply my-3 py-1 px-2 bg-blue-200 rounded block;
}
</style>
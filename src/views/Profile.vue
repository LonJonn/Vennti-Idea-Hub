<template>
	<div class="text-center mt-8">
		<div v-if="!user">
			<h1>Just a sec...😙</h1>
		</div>
		<div v-else>
			<img
				:src="user.photoUrl"
				alt="Profile Picture"
				class="block w-32 mx-auto rounded-full shadow-lg"
			/>
			<h1 class="text-3xl mb-1">{{ user.displayName }}</h1>
			<p class="font-light text-gray-700">Specialising in {{ user.skills.join(", ") }}</p>
			{{ comments }}
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { db } from "@/firebase";
import * as AppTypes from "@/typings";

@Component
export default class Profile extends Vue {
	// State
	user: AppTypes.User = null;
	ref = null;
	contributions = [];
	liked = [];
	comments = [];
	// Hooks
	async mounted() {
		this.ref = db.collection("users").doc(this.$route.params.userId);
		await this.$bind("user", this.ref);
		await this.$bind(
			"contributions",
			db.collectionGroup("assigned").where("owner.id", "==", this.ref.id)
		);
		await this.$bind("liked", db.collectionGroup("likes").where("owner.id", "==", this.ref.id));
		await this.$bind(
			"comments",
			db.collectionGroup("likes").where("owner.id", "==", this.ref.id)
		);
	}
}
</script>
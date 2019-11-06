<template>
	<span class="mb-5">
		<p>likes: {{ likes.length }}</p>
		<button v-if="!userHasLiked" class="like" @click="addLike()">Like</button>
		<button v-else class="like" @click="removeLike()">Unlike</button>
		{{ recentLikes }}
	</span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { db, auth } from "@/firebase";
import { firestore } from "firebase/app";
import * as AppTypes from "@/typings";

@Component
export default class LikesComponent extends Vue {
	// Props
	@Prop() ideaId: string;

	// State
	likes: AppTypes.Like[] = [];
	ref = db
		.collection("ideas")
		.doc(this.ideaId)
		.collection("likes");

	// Hooks
	async mounted() {
		await this.$bind("likes", this.ref.orderBy("createdAt"));
		this.$emit("loaded");
	}

	// Methods
	async addLike(value: string = "👽") {
		const likeRef = this.ref.doc(auth.currentUser.uid);
		const newLike: AppTypes.Like = {
			createdAt: firestore.Timestamp.now(),
			value,
			owner: {
				id: auth.currentUser.uid,
				displayName: auth.currentUser.displayName
			}
		};

		await likeRef.set(newLike);
	}

	async removeLike() {
		const likeRef = this.ref.doc(auth.currentUser.uid);
		await likeRef.delete();
	}

	// Computed
	get userHasLiked() {
		return this.likes.some(like => like.owner.id === auth.currentUser.uid);
	}

	get recentLikes() {
		return (
			this.likes
				.map(
					like =>
						(like.owner.id === auth.currentUser.uid ? "You" : like.owner.displayName) +
						like.value
				)
				.join(", ") || "None"
		);
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
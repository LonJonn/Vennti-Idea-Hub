<template>
	<span class="mb-5">
		<button v-if="!userHasLiked" class="like" @click="addLike()">Like</button>
		<button v-else class="like" @click="removeLike()">Unlike</button>
		{{ recentLikes }}
	</span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { db, auth } from "@/firebase";
import { firestore } from "firebase/app";
import * as AppTypes from "@/models/typings";

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
	async created() {
		await this.$bind("likes", this.ref.orderBy("createdAt"));
		this.$emit("loaded");
	}

	// Methods
	async addLike(value: string = "👽") {
		const ideaRef = db.collection("ideas").doc(this.ideaId);
		const likeRef = this.ref.doc(auth.currentUser.uid);

		const newLike: AppTypes.Like = {
			createdAt: firestore.Timestamp.now(),
			value,
			owner: {
				id: auth.currentUser.uid,
				name: auth.currentUser.displayName
			}
		};

		await db
			.batch()
			.set(likeRef, newLike, { merge: true })
			.update(ideaRef, { likesCount: firestore.FieldValue.increment(1) })
			.commit();
	}

	async removeLike() {
		const ideaRef = db.collection("ideas").doc(this.ideaId);
		const likeRef = this.ref.doc(auth.currentUser.uid);

		await db
			.batch()
			.delete(likeRef)
			.update(ideaRef, { likesCount: firestore.FieldValue.increment(-1) })
			.commit();
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
						(like.owner.id === auth.currentUser.uid ? "You" : like.owner.name) +
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
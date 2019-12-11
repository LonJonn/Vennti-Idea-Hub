<template>
	<span>
		<i v-if="!userHasLiked" class="fas fa-thumbs-up icon-button" @click="addLike()"></i>
		<i v-else class="fas fa-thumbs-up icon-button" @click="removeLike()"></i>
		Liked by {{ readableLikes }}
		<span v-if="remainingLikes.length" class="remaining-likes">
			and {{ remainingLikes.length }} others
			<ul>
				<li v-for="(name, idx) in remainingLikes" :key="idx">{{ name }}</li>
			</ul>
		</span>
	</span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { db, auth } from "@/firebase";
import { firestore } from "firebase/app";
import * as AppTypes from "@/typings";

const increment = firestore.FieldValue.increment(1);
const decrement = firestore.FieldValue.increment(-1);

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
	}

	// Methods
	async addLike(value: string = "👽") {
		const likeRef = this.ref.doc(auth.currentUser.uid);
		const newLike: AppTypes.Like = {
			createdAt: firestore.Timestamp.now(),
			value,
			owner: {
				id: auth.currentUser.uid,
				displayName: auth.currentUser.displayName,
				photoUrl: auth.currentUser.photoURL
			}
		};

		await db
			.batch()
			.set(likeRef, newLike)
			.update(this.ref.parent, { likeCount: increment })
			.commit();
	}

	async removeLike() {
		const likeRef = this.ref.doc(auth.currentUser.uid);

		await db
			.batch()
			.delete(likeRef)
			.update(this.ref.parent, { likeCount: decrement })
			.commit();
	}

	// Computed
	get userHasLiked() {
		return this.likes.some(like => like.owner.id === auth.currentUser.uid);
	}

	get recentLikes() {
		return [...this.likes]
			.sort((a, b) => {
				if (a.owner.id === auth.currentUser.uid) return -1;
				else return 1;
			})
			.slice(0, 2);
	}

	get remainingLikes() {
		return this.likes
			.filter(like => !this.recentLikes.includes(like))
			.map(like => like.owner.displayName);
	}

	get readableLikes() {
		return (
			this.recentLikes
				.map(like =>
					auth.currentUser.uid === like.owner.id ? "You" : like.owner.displayName
				)
				.join(", ") || "None"
		);
	}
}
</script>

<style lang="postcss" scoped>
.remaining-likes {
	@apply relative;
}

.remaining-likes:hover {
	@apply underline;
}

.remaining-likes:hover ul {
	@apply block;
}

.remaining-likes ul {
	@apply hidden absolute mb-5 px-2 py-1;
	@apply text-xs text-white bg-gray-900;
	@apply rounded bottom-0 left-0 whitespace-no-wrap;
}
</style>
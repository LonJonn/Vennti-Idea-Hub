<template>
	<div>
		<form @submit.prevent class="flex items-center mb-2">
			<input
				v-model="content"
				class="comment-input border-gray-500 focus:border-primary-500"
				type="text"
				placeholder="Type comment here..."
			/>
			<i @click="addComment()" class="fas fa-paper-plane icon-button text-gray-800 mx-4" />
		</form>

		<div v-for="comment in comments" :key="comment.id" class="border-b px-4 py-2">
			<p class="mb-1">{{ comment.content }}</p>
			<span
				v-if="isOwner(comment.owner.id)"
				@click="deleteComment(comment.id)"
				class="text-red-500 cursor-pointer float-right hover:underline"
			>Delete</span>
			<router-link
				:to="'/users/' + comment.owner.id"
				class="text-sm text-gray-600 hover:text-blue-600 hover:underline"
			>
				<img
					v-bind:src="comment.owner.photoUrl"
					width="20px"
					alt="User Icon"
					class="inline rounded-full mb-1"
				/>
				{{ comment.owner.displayName }} at {{ comment.createdAt.toDate() | moment("D MMM YY") }}
			</router-link>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { db, auth } from "@/firebase";
import { firestore } from "firebase/app";
import * as AppTypes from "@/typings";

const increment = firestore.FieldValue.increment(1);
const decrement = firestore.FieldValue.increment(-1);

@Component
export default class CommentsComponent extends Vue {
	// Props
	@Prop() ideaId: string;

	// State
	content = "";
	comments: AppTypes.Comment[] = [];
	ref = db
		.collection("ideas")
		.doc(this.ideaId)
		.collection("comments");

	// Hooks
	async mounted() {
		await this.$bind("comments", this.ref.orderBy("createdAt"));
	}

	// Methods
	async addComment() {
		if (!this.content) return alert("Can't have empty comment!");

		const commentRef = this.ref.doc();
		const newComment: AppTypes.Comment = {
			createdAt: firestore.Timestamp.now(),
			owner: {
				id: auth.currentUser.uid,
				displayName: auth.currentUser.displayName,
				photoUrl: auth.currentUser.photoURL
			},
			content: this.content
		};

		this.content = "";

		await db
			.batch()
			.set(commentRef, newComment)
			.update(this.ref.parent, { commentCount: increment })
			.commit();
	}

	async deleteComment(commentId: string) {
		await db
			.batch()
			.delete(this.ref.doc(commentId))
			.update(this.ref.parent, { commentCount: decrement })
			.commit();
	}

	isOwner(id: string) {
		return auth.currentUser.uid === id;
	}
}
</script>

<style lang="postcss" scoped>
.comment-input {
	@apply border-b w-full px-3 py-2 bg-transparent font-light;
}
</style>

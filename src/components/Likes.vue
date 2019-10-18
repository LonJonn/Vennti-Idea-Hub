<template>
	<span v-if="!loading">
		<p>Likes: {{ likes.count }}</p>
		<button v-if="!userHasLiked" class="like" @click="$emit('like')">Like</button>
		<button v-else class="like" @click="$emit('unlike')">Unlike</button>
		{{ recentLikes }}
	</span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { User } from "@/models";
import { State } from "vuex-class";

import { firestore as fs } from "firebase";
import { Like } from "../models/typings";

@Component
export default class LikesComponent extends Vue {
	// Mapped Store
	@State user: User;

	// Props
	@Prop() likesRef: fs.CollectionReference;

	// State
	likes: Like[] = null;
	loading = true;

	// Lifecycle
	async mounted() {
		this.likesRef.onSnapshot(ds => {
			this.likes = ds.docs.map(doc => doc.data() as Like);
		});
		this.loading = false;
	}

	// Computed
	get userHasLiked() {
		return this.likes.some(like => like.ref.id === this.user.id);
	}

	get recentLikes() {
		return this.likes
			.slice(0, 2)
			.map(like => (like.ref.id === this.user.id ? "You" : like.name))
			.join(", ");
	}
}
</script>
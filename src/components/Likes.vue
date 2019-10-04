<template>
	<span v-if="!loading">
		<p>Likes: {{ likes.count }}</p>
		<button v-if="!userHasLiked" class="like" @click="likes.add()">Like</button>
		<button v-else class="like" @click="likes.remove()">Unlike</button>
		{{ recentLikes }}
	</span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { User, Likes } from "@/models";
import { State } from "vuex-class";

@Component
export default class LikesComponent extends Vue {
	// Mapped Store
	@State user: User;

	// Props
	@Prop() ideaId: string;

	// State
	likes: Likes = null;
	loading = true;

	// Lifecycle
	async mounted() {
		this.likes = await new Likes(this.ideaId).init();
		this.loading = false;
	}

	// Computed
	get userHasLiked() {
		return this.likes.userIds.some(id => id === this.user.id);
	}

	get recentLikes() {
		return this.likes.byLatest
			.splice(0, 2)
			.map(like => (like.ref.id === this.user.id ? "You" : like.name))
			.join(", ");
	}
}
</script>
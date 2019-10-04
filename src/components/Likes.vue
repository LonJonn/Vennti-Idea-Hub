<template>
	<div v-if="!loading">
		<p>Likes: {{ likes.count }}</p>
		<button v-if="!userHasLiked" class="like" @click="likes.add()">Like</button>
		<button v-else class="like" @click="likes.remove()">Unlike</button>
		<button class="close" @click="deleteIdea()">Delete</button>
		{{ recentLikes }}
	</div>
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
	@Prop() id: string;

	likes: Likes = null;
	loading = true;

	// Lifecycle
	async mounted() {
		this.likes = await new Likes(this.id).init();
		this.loading = false;
	}

	// Computed
	get recentLikes() {
		return this.likes.byLatest
			.splice(0, 2)
			.map(like => (like.ref.id === this.user.id ? "You" : like.name))
			.join(", ");
	}

	get userHasLiked() {
		return this.likes.userIds.some(id => id === this.user.id);
	}
}
</script>

<style lang="postcss" scoped>
.button {
	@apply text-lg text-white font-semibold px-6 py-1 rounded mt-2;
}

.like {
	@apply button;
	@apply bg-green-500;
}
</style>
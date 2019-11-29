<template>
	<div class="card">
		<router-link tag="h2" :to="'ideas/' + idea.id">{{ idea.benefit }}</router-link>
		<div class="text-gray-600 font-light flex">
			<span class="flex-grow">{{ idea.createdAt.toDate() | moment("D MMM YY") }}</span>
			<router-link :to="'/users/' + idea.owner.id" class="user">
				<img :src="idea.owner.photoUrl" class="rounded-full w-6 mr-2" />
				{{ idea.owner.displayName }}
			</router-link>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as AppTypes from "@/typings";

@Component
export default class IdeaComponent extends Vue {
	// Props
	@Prop() idea: AppTypes.Idea;
}
</script>

<style lang="postcss" scoped>
h2 {
	@apply cursor-pointer font-semibold text-2xl mb-2;
}

h2:hover {
	@apply underline;
}

.card {
	@apply mt-8 rounded-lg bg-white shadow-xl py-3 px-5;

	transition-duration: 0.2s;
	transition-property: box-shadow, transform;
	transition-timing-function: ease-in-out;
}

.card:hover {
	@apply shadow-lifted;
	transform: scale(1.0125);
}

.user {
	@apply flex items-center text-lg cursor-pointer;
}

.user:hover {
	@apply text-blue-500 underline;
}
</style>
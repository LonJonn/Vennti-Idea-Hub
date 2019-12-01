<template>
	<router-link tag="div" :to="'ideas/' + idea.id" class="card flex flex-col">
		<h2>{{ idea.benefit }}</h2>
		<div
			id="content"
			class="text-gray-700 text-sm h-12 overflow-hidden flex-grow"
			style="text-overflow: ellipsis"
		>{{ idea.description }}</div>
		<div id="footer" class="text-gray-600 font-light flex">
			<span class="flex-grow">{{ idea.createdAt.toDate() | moment("D MMM YY") }}</span>
			<router-link :to="'/users/' + idea.owner.id" class="user">
				<img :src="idea.owner.photoUrl" class="rounded-full w-6 mr-2" />
				{{ initials }}
			</router-link>
		</div>
	</router-link>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as AppTypes from "@/typings";

@Component
export default class IdeaComponent extends Vue {
	// Props
	@Prop() idea: AppTypes.Idea;

	get initials() {
		const [first, second] = this.idea.owner.displayName.split(" ");
		if (!second) return first;

		return `${first} ${second[0]}.`;
	}
}
</script>

<style lang="postcss" scoped>
h2 {
	@apply cursor-pointer font-bold text-2xl my-2 leading-tight;

	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.card:hover h2 {
	background: linear-gradient(90deg, #ff8a00, #e52e71);
	-webkit-text-fill-color: transparent;
	-webkit-background-clip: text;
}

.card {
	@apply rounded-xl bg-white shadow-xl py-3 px-5 cursor-pointer;

	min-height: 20rem;

	transition-duration: 0.2s;
	transition-property: box-shadow, transform, background;
	transition-timing-function: ease-in-out;
}

.card:hover {
	@apply shadow-lifted bg-gray-100;
	transform: scale(1.0125);
}

.user {
	@apply flex items-center text-lg cursor-pointer;
}

.user:hover {
	@apply text-blue-500 underline;
}
</style>
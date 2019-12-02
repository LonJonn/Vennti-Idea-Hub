<template>
	<div class="main">
		<router-link tag="div" :to="'ideas/' + idea.id" class="card">
			<h2>{{ idea.benefit }}</h2>
			<div class="content">
				<div
					class="rounded bg-yellow-400 text-yellow-800 px-2 py-1 text-xs mb-2 inline-block"
				>{{ idea.status }}</div>
				<div class="text-blue-600">{{ idea.assignedCount }} assigned</div>
			</div>
			<div class="footer">
				<span class="date">{{ idea.createdAt.toDate() | moment("D MMM YY") }}</span>
				<router-link :to="'/users/' + idea.owner.id" class="user">
					<img :src="idea.owner.photoUrl" align="middle" />
					{{ initials }}
				</router-link>
			</div>
		</router-link>
		<div class="likes" :class="'status-' + idea.status.toLowerCase()">{{ idea.status }}</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as AppTypes from "@/typings";
import { db, auth } from "../../firebase";

@Component
export default class IdeaComponent extends Vue {
	// Props
	@Prop() idea: AppTypes.Idea;

	// Computed
	get initials() {
		const [first, second] = this.idea.owner.displayName.split(" ");
		if (!second) return first;

		return `${first} ${second[0]}.`;
	}
}
</script>

<style lang="postcss" scoped>
.main {
	@apply relative;

	transition-duration: 0.2s;
	transition-property: transform;
	transition-timing-function: ease-in-out;
}

.main:hover {
	transform: scale(1.0125);
}

.card {
	@apply flex flex-col;
	@apply rounded-xl bg-white shadow-xl py-3 px-5 cursor-pointer;

	transition-duration: 0.2s;
	transition-property: background, box-shadow, transform;
	transition-timing-function: ease-in-out;
}

.card:hover {
	@apply shadow-lifted bg-gray-200;
}

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

.card:hover h2 span {
	-webkit-text-fill-color: initial;
	-webkit-background-clip: unset;
}

.content {
	@apply text-gray-700 font-light;
}

.footer {
	@apply flex items-center;
	@apply text-gray-600;
}

.footer .date {
	@apply flex-grow;
}

.footer .user {
	@apply flex items-center;
}

.footer .user img {
	@apply inline w-8 mr-2;
	@apply rounded-full;
}

.footer .user:hover {
	@apply text-blue-500 underline;
}

.likes {
	@apply absolute px-3 py-1;
	@apply font-semibold text-lg;
	@apply rounded-full shadow-full cursor-pointer;

	top: -0.625rem;
	right: -0.625rem;
}

.likes.status-open {
	@apply bg-teal-400 text-teal-800;
}

.likes.status-active {
	@apply bg-blue-500 text-blue-100;
}

.likes.status-done {
	@apply bg-green-400 text-green-800;
}

.likes.status-blocked {
	@apply bg-red-400 text-red-800;
}

@screen sm {
	.card {
		min-height: 20rem;
	}

	.content {
		@apply flex-grow;
	}
}
</style>
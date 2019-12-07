<template>
	<router-link tag="div" :to="'ideas/' + idea.id" class="card">
		<h2 class="capitalize">{{ idea.title }}</h2>
		<div class="content">
			<div class="text-gray-600 font-medium">
				<span>{{ idea.assignedCount }} contributors</span>
				<span class="stats float-right">
					{{ idea.likeCount }}
					<i class="fas fa-thumbs-up"></i>
					{{ idea.commentCount }}
					<i class="fas fa-comments"></i>
				</span>
			</div>

			<hr class="my-2 -mx-2 border-b" />

			<div v-for="(skill, idx) in idea.skillsRequired" :key="idx" class="tag">{{ skill }}</div>
		</div>
		<div class="footer">
			<span class="date">{{ idea.createdAt.toDate() | moment("D MMM YY") }}</span>
			<router-link :to="'/users/' + idea.owner.id" class="user">
				<img :src="idea.owner.photoUrl" align="middle" />
				{{ initials }}
			</router-link>
		</div>
		<div class="status" :class="idea.status.toLowerCase()">{{ idea.status }}</div>
	</router-link>
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
.card {
	@apply flex flex-col relative;
	@apply bg-white shadow-xl py-3 px-5 cursor-pointer;

	border-radius: 20px;

	transition-duration: 0.2s;
	transition-property: background, box-shadow, transform;
	transition-timing-function: ease-in-out;
}

.card:hover {
	@apply shadow-lifted bg-gray-100;

	transform: scale(1.0125);
}

h2 {
	@apply cursor-pointer font-bold text-xl my-2 leading-tight;

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
	@apply text-gray-700;
}

.content .tag {
	@apply inline-block mb-2 mr-2 px-2 py-1;
	@apply bg-indigo-500 text-white;
	@apply text-xs font-semibold rounded;
}

.content .tag:hover {
	@apply bg-indigo-700;
}

.content .tag:before {
	content: "• ";
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

.status {
	@apply absolute px-3 py-1;
	@apply font-semibold text-lg;
	@apply rounded-full shadow-full cursor-pointer;

	top: -0.75rem;
	right: -0.75rem;
}

.status.open {
	@apply bg-teal-400 text-teal-800;
}

.status.active {
	@apply bg-blue-500 text-white;
}

.status.done {
	@apply bg-green-500 text-white;
}

.status.blocked {
	@apply bg-red-500 text-white;
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
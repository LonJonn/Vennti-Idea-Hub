<template>
	<div class="helper">
		<h2>Make sure your idea is</h2>
		<ul class="list">
			<li>
				<i class="check-icon far fa-check-circle"></i>
				<p class="title">Descriptive</p>
				<p
					class="sub"
				>Make sure you thoroughly outline why your idea is great and why others would want to contribute!</p>
			</li>
			<li>
				<i class="check-icon far fa-check-circle"></i>
				<p class="title">Unique</p>
				<p class="sub">Check to see if someone has already put a similar idea up</p>
			</li>
			<li>
				<i class="check-icon far fa-check-circle"></i>
				<p class="title">Impactful</p>
				<p class="sub">Great ideas will help grow the company through your feedback and recommendations</p>
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class HelperComponent extends Vue {}
</script>

<style lang="postcss" scoped>
.helper {
	@apply relative hidden w-2/5 p-12;
	@apply bg-gray-100;
	@apply rounded-xl shadow-xl overflow-hidden;
}

.helper > h2 {
	@apply mb-4;
	@apply text-2xl font-bold;
}

.helper::before {
	content: "";
	@apply absolute block h-24 w-24;
	@apply bg-gray-400;
	@apply rounded-full opacity-75;

	bottom: -1.75em;
	left: 3em;
}

.helper::after {
	content: "";
	@apply absolute block h-8 w-4/5;
	@apply bg-gray-400;
	@apply opacity-75;

	bottom: 2em;
	left: -5em;
	transform: rotate(30deg);
}

.list {
	@apply relative ml-12 mb-8;
}

.list .check-icon {
	@apply absolute w-8;
	@apply text-4xl text-green-500;

	transform: translateX(-135%);
}

.list .title {
	@apply text-2xl text-gray-700 font-light;
}

.list .sub {
	@apply mb-4;
	@apply text-sm text-gray-600;
}

@screen lg {
	.helper {
		@apply block;
	}
}
</style>
<template>
	<div class="about">
		<h1>This is an about page</h1>
		<ul>
			<li v-for="idea of ideas" :key="idea.id">
				<pre>{{ idea }}</pre>
				{{ userId }}
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
import { db } from "../firebase";

import Vue from "vue";
import { mapGetters } from "vuex";
export default Vue.extend({
	name: "about",
	data() {
		return {
			ideas: []
		};
	},
	firestore() {
		return {
			ideas: db.collection("ideas").where("openedBy", "==", this.userId)
		};
	},
	computed: {
		...mapGetters(["userId"])
	},
	methods: {
		test() {
			return this.ideas.length;
		}
	}
});
</script>
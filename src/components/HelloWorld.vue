<template>
	<div>
		<h3>Id: {{ userId }}</h3>
		<pre>{{ this.$store.state.auth.user }}</pre>
		<button
			v-if="!isAuthed"
			class="bg-blue-500 text-white px-3 py-2 rounded-lg mt-2"
			@click="signInAction"
		>Login</button>
		<button
			v-else
			class="bg-red-500 text-white px-3 py-2 rounded-lg mt-2"
			@click="signOutAction"
		>Logout</button>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";

export default Vue.extend({
	name: "HelloWorld",
	methods: {
		...mapActions(["signInAction", "signOutAction"])
	},
	computed: {
		...mapGetters(["isAuthed", "userId"])
	}
});
</script>

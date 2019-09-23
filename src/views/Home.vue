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
import { Vue, Component } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";

import { auth } from "../firebase";

import { User } from "../models";
import { Skill } from "../models/typings";

@Component
export default class Home extends Vue {
	// Mapped Store
	@Getter isAuthed: boolean;
	@Getter userId: string;
	@Action signInAction: () => void;
	@Action signOutAction: () => void;

	get currentAuthUser() {
		return auth.currentUser;
	}
}
</script>
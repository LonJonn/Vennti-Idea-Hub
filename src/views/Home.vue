<template>
	<div>
		<div v-if="user">
			<pre>ID: {{ user.id }}</pre>
			<pre>{{ user.data }}</pre>
		</div>
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
import { Getter, Action, State } from "vuex-class";

import { User } from "../models";

@Component
export default class Home extends Vue {
	// Mapped Store
	@State user: User;
	@Getter isAuthed: boolean;
	@Action signInAction: () => Promise<void>;
	@Action signOutAction: () => Promise<void>;
}
</script>
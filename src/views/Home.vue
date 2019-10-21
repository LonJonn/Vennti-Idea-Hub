<template>
	<div>
		<div v-if="currentUser">
			<pre>ID: {{ currentUser.id }}</pre>
			<pre>{{ currentUser.data }}</pre>
		</div>
		<button
			v-if="!isAuthed"
			class="bg-blue-500 text-white px-3 py-2 rounded-lg mt-2"
			@click="signInAction"
		>Login</button>
		<div v-else>
			<button class="bg-orange-500 text-white px-3 py-2 rounded-lg mt-2" @click="signOutAction">Logout</button>
			<button class="bg-red-500 text-white px-3 py-2 rounded-lg mt-2" @click="deleteAccount">DELETE</button>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { State, Getter, Action } from "vuex-class";

import { User } from "../models";

@Component
export default class Home extends Vue {
	// Mapped Store
	@State currentUser: User;
	@Getter isAuthed: boolean;
	@Action signInAction: () => Promise<void>;
	@Action signOutAction: () => Promise<void>;

	// Methods
	deleteAccount() {
		this.currentUser.delete();
		this.signOutAction();
	}
}
</script>
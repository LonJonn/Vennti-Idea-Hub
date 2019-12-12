<template>
	<v-container>
		<v-layout text-center>
			<button
				v-if="!user"
				@click="login()"
				class="bg-blue-500 text-white px-3 py-2 rounded-lg mt-2"
			>Login</button>
			<div v-else>
				<pre>ID: {{ user.uid }}</pre>
				<span>
					Name:
					<input v-model="user.displayName" class="border-blue-500 border rounded mr-2" />
				</span>
				<button
					:disabled="!displayNameHasChanged"
					@click="updateProfile()"
					class="bg-blue-400 disabled:bg-red-400 disabled:cursor-not-allowed"
				>Change</button>
				<br />
				<button @click="logout()" class="bg-orange-500 text-white px-3 py-2 rounded-lg mt-2">Logout</button>
				<button class="bg-red-500 text-white px-3 py-2 rounded-lg mt-2">DELETE</button>
			</div>
		</v-layout>
	</v-container>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { auth, authProviders, db } from "@/firebase";

@Component
export default class Home extends Vue {
	// State
	user = { ...auth.currentUser };
	currentName = this.user ? this.user.displayName : null; // Should be logged in, but for now check

	mounted() {
		document.body.classList.add("home-background");
	}

	destroyed() {
		document.body.classList.remove("home-background");
	}

	async updateProfile() {
		const { currentUser } = auth;

		currentUser.updateProfile({ displayName: this.user.displayName });
		db.collection("users")
			.doc(currentUser.uid)
			.update({
				displayName: this.user.displayName
			});

		this.currentName = this.user.displayName;
	}

	// Computed
	get displayNameHasChanged() {
		return this.user.displayName !== this.currentName;
	}
}
</script>

<style lang="postcss">
.home-background {
	background: #eef0f7;
}

.home-background::after {
	content: "";

	@apply absolute block;
	@apply bg-white;

	right: -10%;
	left: -10%;
	top: -10%;
	height: 920px;

	z-index: -1;
	transform: skewY(-3deg);
}
</style>
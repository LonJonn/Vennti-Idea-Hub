<template>
	<v-layout>
		<v-flex>
			<h1 class="display-1 text-capitalize font-weight-bold mb-4">{{ $route.name }}</h1>
			<v-btn
				v-if="!user"
				@click="login()"
				class="bg-blue-500 text-white px-3 py-2 rounded-lg mt-2"
			>Login</v-btn>
			<div v-else>
				<pre>ID: {{ user.uid }}</pre>
				<span>
					Name:
					<input v-model="newName" class="border-blue-500 border rounded mr-2" />
				</span>
				<v-btn
					text
					color="primary white--text"
					:disabled="!displayNameHasChanged"
					@click="updateProfile()"
					class="bg-blue-400 disabled:bg-red-400 disabled:cursor-not-allowed"
				>Change</v-btn>
				<br />
				<v-btn
					@click.native="logout()"
					class="bg-orange-500 text-white px-3 py-2 rounded-lg mt-2"
				>Logout</v-btn>
				<v-btn class="bg-red-500 text-white px-3 py-2 rounded-lg mt-2">DELETE</v-btn>
			</div>
		</v-flex>
	</v-layout>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { auth, authProviders, db } from "@/firebase";
import { State } from "vuex-class";

@Component
export default class Home extends Vue {
	// State
	@State user: firebase.User;
	newName = ""; // Should be logged in, but for now check

	auth$ = null;

	mounted() {
		this.auth$ = auth.onAuthStateChanged(user => {
			if (user) this.newName = user.displayName;
		});
	}

	destroyed() {
		this.auth$();
	}

	async updateProfile() {
		this.user.updateProfile({ displayName: this.user.displayName });

		db.collection("users")
			.doc(this.user.uid)
			.update({
				displayName: this.user.displayName
			});

		this.newName = this.user.displayName;
	}

	// Computed
	get displayNameHasChanged() {
		return this.user.displayName !== this.newName;
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
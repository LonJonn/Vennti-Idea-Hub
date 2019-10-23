<template>
	<div>
		<pre>ID: {{ user }}</pre>
		<button v-if="(() => {!user})()" class="bg-blue-500 text-white px-3 py-2 rounded-lg mt-2">Login</button>
		<div v-else>
			<button class="bg-orange-500 text-white px-3 py-2 rounded-lg mt-2">Logout</button>
			<button class="bg-red-500 text-white px-3 py-2 rounded-lg mt-2">DELETE</button>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import { auth } from "@/firebase";
window.auth = auth;

@Component
export default class Home extends Vue {
	user = auth.currentUser;
}
</script>
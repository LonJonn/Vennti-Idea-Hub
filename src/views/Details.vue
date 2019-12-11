<template>
	<div class="font-light">
		<div v-if="!idea">Loading...</div>
		<div v-else>
			<h1 class="capitalize flex items-center">
				New platform to make integrations easier
				<span class="code">VI201</span>
			</h1>
			<p class="-mt-4 text-gray-600">
				Posted on
				<span class="font-normal">{{ idea.createdAt.toDate() | moment("D MMM YY") }}</span> By
				<router-link
					:to="'/users/' + idea.owner.id"
					class="font-normal cursor-pointer hover:text-blue-500 underline"
				>{{ idea.owner.displayName }}</router-link>
			</p>

			<h3>Tracking</h3>
			<div class="text-gray-700 text-sm mb-5">
				<div role="progressbar" class="relative bg-green-200 rounded-full h-4 overflow-hidden mb-1">
					<div
						role="progress"
						class="bg-green-500 h-full text-white flex flex-col items-center justify-center text-xs"
						:style="'width: ' + 45 +'%;'"
					>45%</div>
				</div>
				<span>Due 14 Nov. 2020 • 3 weeks from now</span>
				<span class="float-right">
					Logged
					<span class="font-medium">14 / 20</span> hours
				</span>
			</div>

			<h3>Current Team</h3>
			<p class="flex">
				<router-link
					v-for="user in assigned.map(assignment => assignment.owner)"
					:key="user.id"
					:to="'/users/' + user.id"
					:aria-label="user.displayName"
					class="mr-4"
				>
					<img class="user-img" :src="user.photoUrl" />
				</router-link>
				<span v-if="!assigned.length">Currently no contributors... 😭 But you can be the first! 😁</span>
			</p>

			<h3>Value</h3>
			<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio quod qui harum sit, vel odio hic illo assumenda iure tempore itaque fugiat alias laborum voluptas unde eum? Ducimus, error ratione!</p>

			<h3>Description</h3>
			<div class="mb-5 rounded bg-gray-200 border px-5 py-3">
				<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex ab totam eius qui necessitatibus voluptatem consectetur quis ipsum, incidunt, quisquam minus nobis officia animi quas dolorem corporis magnam nostrum veniam?</p>
				<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex ab totam eius qui necessitatibus voluptatem consectetur quis ipsum, incidunt, quisquam minus nobis officia animi quas dolorem corporis magnam nostrum veniam?</p>
				<ul>
					<li>Something</li>
					<li>Else</li>
					<li>Cool</li>
				</ul>
			</div>

			<AppLikes :ideaId="idea.id" class="text-gray-700" />
			<div class="float-right">
				<button
					v-if="!userIsAssigned"
					@click="assignUser()"
					class="text-blue-500 hover:underline"
				>Join Project</button>
				<button v-else @click="unassignUser()" class="text-red-500 hover:underline">Leave Project</button>
			</div>

			<AppComments :ideaId="idea.id" class="my-12" />
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AppLikes from "@/components/Details/Likes.vue";
import AppComments from "@/components/Details/Comments.vue";
import { db, auth } from "@/firebase";
import { firestore } from "firebase/app";
import * as AppTypes from "@/typings";

const increment = firestore.FieldValue.increment(1);
const decrement = firestore.FieldValue.increment(-1);

@Component({ components: { AppLikes, AppComments } })
export default class Details extends Vue {
	// State
	idea: AppTypes.Idea = null;
	ref = db.collection("ideas").doc(this.$attrs.ideaId);
	assigned: AppTypes.Assignment[] = [];

	// Hooks
	async mounted() {
		await this.$bind("idea", this.ref);
		await this.$bind("assigned", this.ref.collection("assigned"));
	}

	// Methods
	remove() {
		if (confirm("Are you sure?")) {
			db.collection("ideas")
				.doc(this.idea.id)
				.delete();

			this.$router.push("/ideas");
		}
	}

	// Turn into function (Used in Likes.vue as well)
	async assignUser() {
		const assignmentRef = this.ref.collection("assigned").doc(auth.currentUser.uid);
		const newAssignment: AppTypes.Assignment = {
			owner: {
				id: auth.currentUser.uid,
				displayName: auth.currentUser.displayName,
				photoUrl: auth.currentUser.photoURL
			},
			createdAt: firestore.Timestamp.now()
		};

		await db
			.batch()
			.set(assignmentRef, newAssignment)
			.update(this.ref, { assignedCount: increment })
			.commit();
	}

	async unassignUser() {
		const assignmentRef = this.ref.collection("assigned").doc(auth.currentUser.uid);

		await db
			.batch()
			.delete(assignmentRef)
			.update(this.ref, { assignedCount: decrement })
			.commit();
	}

	// Computed
	get userIsAssigned() {
		return this.assigned.some(assigment => assigment.owner.id === auth.currentUser.uid);
	}
}
</script>

<style lang="postcss" scoped>
h3 {
	@apply font-semibold mb-1;
}

p {
	@apply mb-5;
}

ul > li {
	@apply list-disc ml-5;
}

.code {
	@apply inline-block px-3 py-1 ml-3;
	@apply text-sm bg-gray-300 text-gray-700 font-semibold;
	@apply rounded;
}

.user-img {
	@apply w-8 h-8;
	@apply rounded-full;

	transition-duration: 0.2s;
	transition-property: box-shadow, transform;
	transition-timing-function: ease-in-out;
}

.user-img:hover {
	@apply shadow-md;
	transform: scale(1.15);
}
</style>
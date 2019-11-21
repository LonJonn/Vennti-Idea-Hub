<template>
	<div>
		<AppIdea v-for="idea of ideas" :key="idea.id" :idea="idea" />
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppIdea from "@/components/List/Idea.vue";
import { db } from "@/firebase";
import { firestore } from "firebase/app";
import * as AppTypes from "@/typings";

@Component({
	components: { AppIdea },
	firestore: {
		ideas: db
			.collection("ideas")
			.orderBy("createdAt", "desc")
			.limit(10)
	}
})
export default class List extends Vue {
	// State
	ideas: AppTypes.Idea[] = [];
}
</script>

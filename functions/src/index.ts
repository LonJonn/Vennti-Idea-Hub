import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

export const userDeleteSync = functions.firestore
	.document("users/{userId}")
	.onDelete(async user => {
		// Get all user ideas
		const ideasToDelete = await db
			.collection("ideas")
			.where("owner.ref", "==", user.ref)
			.get();

		// Get each like bucket document for each idea
		const likesToDelete = await Promise.all(
			ideasToDelete.docs.map(ideaQs =>
				db
					.collection("likes")
					.doc(ideaQs.id)
					.get()
			)
		);

		// Delete user idea and its corresponding like bucket
		await Promise.all(ideasToDelete.docs.map(idea => idea.ref.delete()));
		await Promise.all(likesToDelete.map(like => like.ref.delete()));

		// Get all like buckets where user has liked
		const likesToRemove = await db
			.collection("likes")
			.orderBy(user.id)
			.get();

		// For each like bucket
		likesToRemove.docs.forEach(like => {
			// Delete user map
			like.ref.update({
				[user.id]: admin.firestore.FieldValue.delete()
			});
			// Decrement idea like count of corresponding like bucket
			db.collection("ideas")
				.doc(like.id)
				.update({
					likesCount: admin.firestore.FieldValue.increment(-1)
				});
		});
	});

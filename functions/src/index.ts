import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

export const userDeleteSync = functions.firestore
	.document("users/{userId}")
	.onDelete(async deletedUser => {
		/**
		 * *Batch #1*
		 * **Removing User Ideas and corresponding Like buckets**
		 */
		// Get all User Idea refs
		const ideasToDelete = (await await db
			.collection("ideas")
			.where("owner.ref", "==", deletedUser.ref)
			.get()).docs.map(doc => doc.ref);

		// Get each Like Bucket ref for each Idea
		const likesToDelete = ideasToDelete.map(ideaDoc => db.collection("likes").doc(ideaDoc.id));

		// Delete User Ideas and corresponding Like buckets
		const batchDelete = db.batch();
		ideasToDelete.map(ideaRef => batchDelete.delete(ideaRef));
		likesToDelete.map(likesRef => batchDelete.delete(likesRef));
		await batchDelete.commit();
		console.info("User Ideas and corresponding Like Buckets deleted");

		/**
		 * *Batch #2*
		 * **Removing User likes from other users Ideas**
		 */
		// Get all Like Buckets where User has liked
		const likesToRemove = (await db
			.collection("likes")
			.orderBy(deletedUser.id)
			.get()).docs.map(likeBucketDoc => likeBucketDoc.ref);

		const batchRemoveLike = db.batch();
		// For each Like Bucket
		likesToRemove.forEach(likeBucket => {
			const ideaRef = db.collection("ideas").doc(likeBucket.id);
			// Delete User map
			batchRemoveLike.update(likeBucket, {
				[deletedUser.id]: admin.firestore.FieldValue.delete()
			});
			// Decrement Idea `ikeCount of corresponding Like Bucket
			batchRemoveLike.update(ideaRef, {
				likesCount: admin.firestore.FieldValue.increment(-1)
			});
		});
		await batchRemoveLike.commit();
		console.info("User likes removed");

		// Once Finished
		console.info("User delete completed");
	});

export const ideaDeleteSync = functions.firestore
	.document("ideas/{ideaId}")
	.onDelete(deletedIdea => {
		db.collection("likes")
			.doc(deletedIdea.ref.id)
			.delete();
	});

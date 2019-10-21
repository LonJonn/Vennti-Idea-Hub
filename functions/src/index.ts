import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp(functions.config().firebase);

// Global firestore instance
const db = admin.firestore();

/**
 * >>> **Keeps database in sync on user delete**
 */
export const userDeleteSync = functions.firestore
	.document("users/{userId}")
	.onDelete(async deletedUser => {
		console.info("User batch delete started.");

		// Creating batch
		const batch = db.batch();

		/**
		 * *Batch #1*
		 * **Removing User Likes**
		 */
		// Get all User likes in all subcollections
		const likes = await db
			.collectionGroup("likes")
			.where("ref", "==", deletedUser.ref)
			.get();
		// Delete each like document in subcollection & update parent `userLikes` Array
		likes.forEach(likeDoc => {
			batch.delete(likeDoc.ref);
			batch.update(likeDoc.ref.parent.parent!, {
				userLikes: admin.firestore.FieldValue.arrayRemove(deletedUser.id)
			});
		});

		/**
		 * *Batch #2*
		 * **Removing User Idea**
		 */
		// Get all User Ideas
		const ideas = await db
			.collection("ideas")
			.where("owner.ref", "==", deletedUser.ref)
			.get();
		// Delete each user Idea
		ideas.forEach(ideaDoc => batch.delete(ideaDoc.ref));

		// Commit batch
		try {
			await batch.commit();
			console.log("User deleted");
		} catch (error) {
			console.error("Batch deleted failed!\nUser not deleted.");
		}
	});

/**
 * >>> **Recursively delete idea likes**
 */
export const ideaDeleteSync = functions.firestore
	.document("ideas/{ideaId}")
	.onDelete(async deletedIdea => {
		console.info("Idea deleted. Recursively deleting likes.");

		// Create batch
		const batch = db.batch();

		// Delete all likes in deleted idea subcollection
		const likes = await deletedIdea.ref.collection("likes").get();
		likes.forEach(like => batch.delete(like.ref));

		// Commit batch
		batch.commit();
	});

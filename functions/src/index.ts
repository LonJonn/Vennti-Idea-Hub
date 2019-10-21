import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp(functions.config().firebase);

// Global firestore instance
const db = admin.firestore();

/**
 * **<==Sync database on user delete==>**
 */
export const userDeleteSync = functions.firestore
	.document("users/{userId}")
	.onDelete(async deletedUser => {
		console.info("User batch delete started.");

		// Creating batch
		const batch = db.batch();

		/**
		 * *<==Batch #1==>*
		 * **Removing User Likes**
		 */
		// Get all User likes in all subcollections
		const likes = await db
			.collectionGroup("likes")
			.where("ref", "==", deletedUser.ref)
			.get();
		// Delete each like document in subcollection & update parent `likes` Array
		likes.forEach(likeDoc => {
			batch.delete(likeDoc.ref);
			batch.update(likeDoc.ref.parent.parent!, {
				likes: admin.firestore.FieldValue.arrayRemove(deletedUser.id)
			});
		});

		/**
		 * *<==Batch #2==>*
		 * **Removing User Assignments**
		 */
		// Get all User assignments in all subcollections
		const assignments = await db
			.collectionGroup("assignments")
			.where("ref", "==", deletedUser.ref)
			.get();
		// Delete each assignment in subcollection & update parent `assignments` Array
		assignments.forEach(assignmentDoc => {
			batch.delete(assignmentDoc.ref);
			batch.update(assignmentDoc.ref.parent.parent!, {
				assignments: admin.firestore.FieldValue.arrayRemove(deletedUser.id)
			});
		});

		/**
		 * *<==Batch #3==>*
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
 * **<==Recursively delete idea likes==>**
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

		// Delete all assignments in deleted idea subcollection
		const assignments = await deletedIdea.ref.collection("assignments").get();
		assignments.forEach(assignment => batch.delete(assignment.ref));

		// Commit batch
		batch.commit();
	});

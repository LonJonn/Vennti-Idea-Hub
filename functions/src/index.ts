import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { FieldValue } from "@google-cloud/firestore";
admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

// NEED TO UPDATE!!!
// /**
//  * **<==Sync database on user delete==>**
//  */
// export const userDeleteSync = functions.firestore
// 	.document("users/{userId}")
// 	.onDelete(async deletedUser => {
// 		console.info("User batch delete started.");

// 		// Creating batch
// 		const batch = db.batch();

// 		/**
// 		 * *<==Batch #1==>*
// 		 * **Removing User Likes**
// 		 */
// 		// Get all User likes in all subcollections
// 		const likes = await db
// 			.collectionGroup("likes")
// 			.where("ref", "==", deletedUser.ref)
// 			.get();

// 		// Delete each like document in subcollection & update parent `likes` Array
// 		likes.forEach(likeDoc => {
// 			batch.delete(likeDoc.ref);
// 			batch.update(likeDoc.ref.parent.parent!, {
// 				likes: admin.firestore.FieldValue.arrayRemove(deletedUser.id)
// 			});
// 		});

// 		/**
// 		 * *<==Batch #2==>*
// 		 * **Removing User Assignments**
// 		 */
// 		// Get all User assignments in all subcollections
// 		const assignments = await db
// 			.collectionGroup("assignments")
// 			.where("ref", "==", deletedUser.ref)
// 			.get();

// 		// Delete each assignment in subcollection & update parent `assignments` Array
// 		assignments.forEach(assignmentDoc => {
// 			batch.delete(assignmentDoc.ref);
// 			batch.update(assignmentDoc.ref.parent.parent!, {
// 				assignments: admin.firestore.FieldValue.arrayRemove(deletedUser.id)
// 			});
// 		});

// 		/**
// 		 * *<==Batch #3==>*
// 		 * **Removing User Idea**
// 		 */
// 		// Get all User Ideas
// 		const ideas = await db
// 			.collection("ideas")
// 			.where("owner.ref", "==", deletedUser.ref)
// 			.get();

// 		// Delete each user Idea
// 		ideas.forEach(ideaDoc => batch.delete(ideaDoc.ref));

// 		// Commit batch
// 		try {
// 			await batch.commit();
// 			console.log("User deleted");
// 		} catch (error) {
// 			console.error("Batch deleted failed!\nUser not deleted.");
// 		}
// 	});

/**
 * **<==Recursively delete Idea==>**
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
		const assignments = await deletedIdea.ref.collection("assigned").get();
		assignments.forEach(assignment => batch.delete(assignment.ref));

		// Delete all comments in deleted idea subcollection
		const comments = await deletedIdea.ref.collection("comments").get();
		comments.forEach(comment => batch.delete(comment.ref));

		// Commit batch
		batch.commit();
	});

/**
 * **<==Sync count on Idea like==>**
 */
export const onLike = functions.firestore
	.document("ideas/{ideaId}/likes/{likeId}")
	.onWrite((change, context) => {
		/**
		 * *On Add Like*
		 */
		if (!change.before.exists) {
			db.collection("ideas")
				.doc(context.params["ideaId"])
				.update({ likesCount: FieldValue.increment(1) });
		}

		/**
		 * *On Remove Like*
		 */
		if (!change.after.exists) {
			db.collection("ideas")
				.doc(context.params["ideaId"])
				.update({ likesCount: FieldValue.increment(-1) });
		}
	});

/**
 * **<==Sync count on Idea assignment==>**
 */
export const onAssignment = functions.firestore
	.document("ideas/{ideaId}/assigned/{assignmentId}")
	.onWrite((change, context) => {
		/**
		 * *On Assignment*
		 */
		if (!change.before.exists) {
			db.collection("ideas")
				.doc(context.params["ideaId"])
				.update({ assignedCount: FieldValue.increment(1) });
		}

		/**
		 * *On Unassign*
		 */
		if (!change.after.exists) {
			db.collection("ideas")
				.doc(context.params["ideaId"])
				.update({ assignedCount: FieldValue.increment(-1) });
		}
	});

/**
 * **<==Sync count on Idea comment==>**
 */
export const onComment = functions.firestore
	.document("ideas/{ideaId}/comments/{assignmentId}")
	.onWrite((change, context) => {
		/**
		 * *On Assignment*
		 */
		if (!change.before.exists) {
			db.collection("ideas")
				.doc(context.params["ideaId"])
				.update({ commentCount: FieldValue.increment(1) });
		}

		/**
		 * *On Unassign*
		 */
		if (!change.after.exists) {
			db.collection("ideas")
				.doc(context.params["ideaId"])
				.update({ commentCount: FieldValue.increment(-1) });
		}
	});

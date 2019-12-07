import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp(functions.config().firebase);

console.log(functions.config().firebase);

// import * as algoliasearch from "algoliasearch";
// const { algolia } = functions.config();

// const client = algoliasearch(algolia.app, algolia.key);
// const ideas = client.initIndex("ideas");

// Global firestore instance
const db = admin.firestore();

/**
 * Algolia Indexing
 */
// export const addToIndex = functions.firestore.document("ideas/{ideaId}").onCreate(snapshot => {
// 	const data = snapshot.data();
// 	const objectId = snapshot.id;

// 	return ideas.addObject({
// 		...data,
// 		objectId
// 	});
// });

// export const updateIndex = functions.firestore.document("ideas/{ideaId}").onUpdate(change => {
// 	const data = change.after.data();
// 	const objectId = change.after.id;

// 	return ideas.saveObject({
// 		...data,
// 		objectId
// 	});
// });

// export const deleteFromIndex = functions.firestore.document("ideas/{ideaId}").onDelete(snapshot => {
// 	const objectId = snapshot.id;

// 	return ideas.deleteObject(objectId);
// });

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

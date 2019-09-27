import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp(functions.config().firebase);

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

export const aggregateIdeaOwner = functions.firestore
	.document("users/{userId}")
	.onWrite(async ({ before, after }) => {
		const sameName = before.exists && before.data()!.name == after.data()!.name;

		if (!sameName) {
			const qs = await admin
				.firestore()
				.collection("ideas")
				.where("owner.ref", "==", after.ref)
				.get();

			const ownerIdeaRefs = qs.docs.map(doc => doc.ref);

			const batch = admin.firestore().batch();

			ownerIdeaRefs.forEach(ideaRef =>
				batch.update(ideaRef, {
					owner: {
						name: after.data()!.name,
						ref: after.ref
					}
				})
			);

			batch.commit();
		}
	});

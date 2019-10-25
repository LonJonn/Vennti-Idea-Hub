import { db } from "@/firebase";
import { firestore } from "firebase/app";

export async function subcollectionAdd(
	docRef: firestore.DocumentReference,
	data: firestore.DocumentData,
	toIncrement: string
) {
	await db
		.batch()
		.set(docRef, data, { merge: true })
		.update(docRef.parent.parent, {
			[toIncrement]: firestore.FieldValue.increment(1)
		})
		.commit();
}

export async function subcollectionRemove(
	docRef: firestore.DocumentReference,
	toDecrement: string
) {
	await db
		.batch()
		.delete(docRef)
		.update(docRef.parent.parent, { [toDecrement]: firestore.FieldValue.increment(-1) })
		.commit();
}

import { db } from "@/firebase";

type qsType = firebase.firestore.QueryDocumentSnapshot;

export default abstract class BaseDocument {
	id: string = null;
	ref: firebase.firestore.DocumentReference;

	constructor(collection: string, init?: string | qsType) {
		if (typeof init === "string") {
			this.ref = db.collection(collection).doc(init);
		} else if (init) {
			this.ref = init.ref;
			this.setState(init.data());
		} else {
			this.ref = db.collection(collection).doc();
		}

		this.id = this.ref.id;
	}

	async fetch() {
		const data = (await this.ref.get()).data();
		this.setState(data);
		return this;
	}

	async set(data: firebase.firestore.DocumentData) {
		await this.ref.set(data);
		await this.fetch();
	}

	async update(newData: firebase.firestore.UpdateData) {
		await this.ref.update(newData);
		await this.fetch();
	}

	async delete() {
		await this.ref.delete();
	}

	private setState(data: firebase.firestore.DocumentData) {
		for (const key in data) {
			if (data[key]) this[key] = data[key];
		}

		return this;
	}
}

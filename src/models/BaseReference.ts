import { db } from "@/firebase";
import { firestore as fs } from "firebase/app";

export default abstract class BaseReference<T, U> {
	private _ref: fs.DocumentReference;
	private _instanceOf: string;
	protected _data: T;

	protected checkInit() {
		if (!this._data) {
			const singular = this._instanceOf[0].toUpperCase() + this._instanceOf.slice(1, -1);
			throw new Error(`${singular} instance not initialised.\nPlease call .init().`);
		}
	}

	constructor(collection: string, init?: string | fs.DocumentReference) {
		this._instanceOf = collection;
		const cRef = db.collection(this._instanceOf);

		if (init instanceof fs.DocumentReference) {
			this._ref = init;
		} else if (typeof init === "string") {
			this._ref = cRef.doc(init);
		} else {
			this._ref = cRef.doc(); // create new reference if no initial provided
		}
	}

	get ref() {
		return this._ref;
	}

	get id() {
		return this._ref.id;
	}

	get data() {
		return this._data;
	}

	/**
	 * **WARNING**: sets data in firestore *asynchronously*!
	 *
	 * However, Local instance is updated immediately and can be accessed via `data` property.
	 */
	set data(payload: T) {
		this._ref.set(payload);
		this._data = payload;
	}

	async init() {
		if (this._data) throw new Error(`${this.id}: Already initiated.`);

		const doc = await this._ref.get();
		this._data = doc.data() as T;
		return this;
	}

	async update(newData: U) {
		this.checkInit();

		Object.assign(this._data, newData);
		await this._ref.update(newData);
	}

	async delete() {
		await this._ref.delete();
	}
}

import BaseReference from "./BaseReference";
import { IdeaData } from "./typings";

export default class Idea extends BaseReference {
	private _data: IdeaData;

	constructor(id?: string) {
		super("users", id);
	}

	async init() {
		const doc = await this.ref.get();
		this._data = doc.data() as IdeaData;
		return this;
	}

	get data() {
		return this._data;
	}
}

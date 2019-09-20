import BaseReference from "./BaseReference";
import { UserData, UpdateUser, Skill } from "./typings";
import { firestore as fs } from "firebase/app";

export default class User extends BaseReference {
	private _data: UserData;

	constructor(init?: string | fs.DocumentReference) {
		super("users", init);
	}

	get data() {
		return this._data;
	}

	async init() {
		const doc = await this.ref.get();
		this._data = doc.data() as UserData;
		return this;
	}

	// Is there a better way to do this?
	async update(newData: UpdateUser) {
		Object.assign(this._data, newData);
		await super.update(newData);
	}

	async addSkill(newSkill: Skill) {
		if (this._data.skills.includes(newSkill)) throw new Error("User already has this skill.");
		await this.update({
			skills: [...this._data.skills, newSkill]
		});
	}

	async removeSkill(toRemove: Skill) {
		if (!this._data.skills.includes(toRemove))
			throw new Error("User does not have that skill.");
		await this.update({
			skills: this._data.skills.filter(skill => skill !== toRemove)
		});
	}
}

import BaseReference from "./BaseReference";
import { UserData, UpdateUser, Skill } from "./typings";
import Idea from "./Idea";
import store from "@/store";

/**
 * If no intial value is passed, a *new* document reference will be created within the passed collection.
 *
 * Instance is **NOT** written to Firestore until calling `.ref.set` *OR* setting the `data` property.
 * @classdesc
 * @param collection The target Firestore collection (e.g. "ideas")
 * @param init Optional param for existing documents
 */
export default class User extends BaseReference<UserData, UpdateUser> {
	/**
	 * If no intial value is passed, a *new* document reference will be created within the users collection.
	 *
	 * Instance is **NOT** written to Firestore until calling `.ref.set` *OR* setting the `data` property.
	 * @param init Optional param for existing documents
	 */
	constructor(init) {
		super("users", init);
	}

	/**
	 * Adds a new skill to the user and writes to Firestore.
	 * Throws an Error if skill is already know.
	 * @param newSkill Skill to be added - **must** be from `Skill` Enum
	 * @requires src/models/typings
	 */
	async addSkill(newSkill: Skill) {
		this.checkInit();

		if (this.data.skills.includes(newSkill)) throw new Error("User already has this skill.");
		await this.update({
			skills: [...this.data.skills, newSkill]
		});
	}

	/**
	 * Removes skilsl from the user and writes to Firestore.
	 * Throws an Error if skill is not known.
	 * @param toRemove Skill to be removed - **must** be from `Skill` Enum
	 * @requires src/models/typings
	 */
	async removeSkill(toRemove: Skill) {
		this.checkInit();

		if (!this.data.skills.includes(toRemove)) throw new Error("User does not have that skill.");
		await this.update({
			skills: this.data.skills.filter(skill => skill !== toRemove)
		});
	}

	async delete() {
		const cascade = await Idea.all.where("owner", "==", this.ref).get();
		await Promise.all(cascade.docs.map(doc => doc.ref.delete()));
		await super.delete();

		store.dispatch("signOutAction");
	}
}

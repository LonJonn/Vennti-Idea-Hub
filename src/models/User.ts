import { firestore as fs } from "firebase/app";
import BaseReference from "./BaseReference";
import { Skill, UpdateUser, UserData } from "./typings";

export default class User extends BaseReference<UserData, UpdateUser> {
	/**
	 * If no intial value is passed, a *new* document reference will be created within the users collection.
	 *
	 * Instance is **NOT** written to Firestore until calling `.ref.set` *OR* setting the `data` property.
	 * @param init Optional param for existing documents
	 */
	constructor(init?: string | fs.DocumentReference) {
		super("users", init);
	}

	/**
	 * Adds a new skill to the user and writes to Firestore.
	 * Throws an Error if skill is already know.
	 * @param newSkill Skill to be added - **must** be from `Skill` Enum
	 * @requires src/models/typings
	 */
	async addSkill(newSkill: Skill) {
		await this.update({
			skills: fs.FieldValue.arrayUnion(newSkill)
		});
	}

	/**
	 * Removes skills from the user and writes to Firestore.
	 * Throws an Error if skill is not known.
	 * @param toRemove Skill to be removed - **must** be from `Skill` Enum
	 * @requires src/models/typings
	 */
	async removeSkill(toRemove: Skill) {
		await this.update({
			skills: fs.FieldValue.arrayRemove(toRemove)
		});
	}
}

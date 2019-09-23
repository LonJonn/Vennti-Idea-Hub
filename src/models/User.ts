import BaseReference from "./BaseReference";
import { UserData, UpdateUser, Skill } from "./typings";

export default class User extends BaseReference<UserData, UpdateUser> {
	constructor(init) {
		super("users", init);
	}

	async addSkill(newSkill: Skill) {
		this.checkInit();

		if (this.data.skills.includes(newSkill)) throw new Error("User already has this skill.");
		await this.update({
			skills: [...this.data.skills, newSkill]
		});
	}

	async removeSkill(toRemove: Skill) {
		this.checkInit();

		if (!this.data.skills.includes(toRemove)) throw new Error("User does not have that skill.");
		await this.update({
			skills: this.data.skills.filter(skill => skill !== toRemove)
		});
	}
}

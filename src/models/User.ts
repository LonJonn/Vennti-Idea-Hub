import BaseDocument from "./BaseDocument";

type qsType = firebase.firestore.QueryDocumentSnapshot;

export default class User extends BaseDocument {
	name: string = null;
	skills: Skill[] = null;
	commentsCount: number = null;

	constructor(id?: string | qsType) {
		super("users", id);
	}

	getSkills() {
		if (!this.skills) return;
		return this.skills.map(skillVal => Skill[skillVal]);
	}
}

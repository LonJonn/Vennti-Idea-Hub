import User from "./User";

export enum Skill {
	Technical,
	Business,
	ProjectManager,
	DMP,
	CDP
}

export enum IdeaStatus {
	Open,
	Active,
	Solved,
	Blocked
}

export enum IdeaDifficulty {
	Easy,
	Medium,
	Hard
}

export interface UserData {
	name: string;
	skills: Skill[];
	commentsCount: number;
}

export interface UpdateUser {
	name?: string;
	skills?: Skill[];
}

export interface NewIdea {
	benefit: string;
	createdOn: firebase.firestore.Timestamp;
	description: string;
	owner: User; // Temp
	skillsRequired: Skill[];
	timeEstimation: [number, number];
}

export interface IdeaData extends NewIdea {
	assigned: User[]; // Temp
	likes: User[]; // Temp
	status: IdeaStatus;
}

export interface UpdateIdea {
	benefit?: string;
	description?: string;
	status?: IdeaStatus;
	skillsRequired?: Skill[];
	timeEstimation?: [number, number];
}

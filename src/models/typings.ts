import User from "./User";
import { firestore as fs } from "firebase/app";

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
	owner: fs.DocumentReference;
	skillsRequired: Skill[];
	timeEstimation: [number, number];
}

export interface IdeaData extends NewIdea {
	assigned: fs.DocumentReference[];
	likes: fs.DocumentReference[];
	status: IdeaStatus;
}

export interface UpdateIdea {
	benefit?: string;
	description?: string;
	status?: IdeaStatus;
	skillsRequired?: Skill[];
	timeEstimation?: [number, number];
}

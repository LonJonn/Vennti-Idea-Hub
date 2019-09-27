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
	skills?: fs.FieldValue;
}

export interface NewIdea {
	benefit: string;
	description: string;
	skillsRequired: Skill[];
	timeEstimation: [number, number];
}

export interface IdeaData extends NewIdea {
	owner: { ref: fs.DocumentReference; name: string };
	createdOn: firebase.firestore.Timestamp;
	assigned: fs.DocumentReference[];
	status: IdeaStatus;
}

export interface UpdateIdea {
	benefit?: string;
	description?: string;
	status?: IdeaStatus;
	skillsRequired?: fs.FieldValue;
	timeEstimation?: [number, number];
	likes?: fs.FieldValue;
}

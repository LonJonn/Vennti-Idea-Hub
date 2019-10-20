import { firestore as fs } from "firebase/app";

// Enums

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

// User

export interface UserData {
	name: string;
	skills: Skill[];
	commentsCount: number;
}

export interface UpdateUser {
	name?: string;
	skills?: fs.FieldValue;
}

// Idea

export interface NewIdea {
	benefit: string;
	description: string;
	skillsRequired: Skill[];
	timeEstimation: [number, number];
}

export interface IdeaData extends NewIdea {
	owner: { ref: fs.DocumentReference; name: string };
	assigned: Array<{ ref: fs.DocumentReference; name: string; dateAssigned: fs.Timestamp }>;
	status: IdeaStatus;
	createdOn: firebase.firestore.Timestamp;
	userLikes: string[];
	likes?: fs.CollectionReference;
}

export interface UpdateIdea {
	benefit?: string;
	description?: string;
	status?: IdeaStatus;
	skillsRequired?: fs.FieldValue;
	timeEstimation?: [number, number];
}

// Likes

export interface Like {
	ref: fs.DocumentReference;
	name: string;
	createdAt: fs.Timestamp;
}

import { firestore as fs } from "firebase";

/**
 * **<==Enums==>**
 */
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

/**
 * **<==Users==>**
 */
export interface UserData {
	name: string;
	skills: Skill[];
	commentsCount: number;
}

export interface UpdateUser {
	name?: string;
	skills?: fs.FieldValue;
}

/**
 * **<==Ideas==>**
 */
export interface NewIdea {
	benefit: string;
	description: string;
	skillsRequired: Skill[];
	timeEstimation: [number, number];
}

export interface IdeaData extends NewIdea {
	owner: { ref: fs.DocumentReference; name: string };
	assignments: string[];
	status: IdeaStatus;
	createdOn: fs.Timestamp;
	likes: string[];
}

export interface UpdateIdea {
	benefit?: string;
	description?: string;
	status?: IdeaStatus;
	skillsRequired?: fs.FieldValue;
	timeEstimation?: [number, number];
	likes?: fs.FieldValue;
	assignments?: fs.FieldValue;
}

/**
 * **<==Likes==>**
 */
export interface Like {
	ref: fs.DocumentReference;
	name: string;
	createdAt: fs.Timestamp;
	type: string;
}

/**
 * **<==Assignments==>**
 */
export interface Assignment {
	ref: fs.DocumentReference;
	name: string;
	assignedAt: fs.Timestamp;
}

import { firestore } from "firebase/app";

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

export enum Status {
	Open,
	Active,
	Solved,
	Blocked
}

export enum Difficulty {
	Easy,
	Medium,
	Hard
}

/**
 * **<==Users==>**
 */
export interface User {
	displayName: string;
	skills: Skill[];
}

interface Owner {
	id: string;
	displayName: string;
	photoUrl?: string;
}

export interface UpdateUserSkills {
	skills: firestore.FieldValue;
}

/**
 * **<==Ideas==>**
 */
export interface Idea extends IdeaNew {
	id?: string;
	owner: Owner;
	status: Status;
	difficulty: Difficulty;
	createdAt: firebase.firestore.Timestamp;
	assignedCount: number;
	likesCount: number;
	commentCount: number;
}

export interface IdeaNew {
	benefit: string;
	description: string;
	skillsRequired: Skill[];
	timeEstimation: [number, number];
}

export interface IdeaUpdate {
	benefit?: string;
	description?: string;
	status?: Status;
	skillsRequired?: firestore.FieldValue;
	timeEstimation?: [number, number];
}

/**
 * **<==Likes==>**
 */
export interface Like {
	owner: Owner;
	createdAt: firestore.Timestamp;
	value: string;
}

/**
 * **<==Assignments==>**
 */
export interface Assignment {
	owner: Owner;
	createdAt: firestore.Timestamp;
}

/**
 * **<==Comments==>**
 */
export interface Comment {
	owner: Owner;
	createdAt: firestore.Timestamp;
	content: string;
}

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
export interface User {
	skills: Skill[];
}

export interface UpdateUserSkills {
	skills: fs.FieldValue;
}

// Idea
export interface NewIdea {
	benefit: string;
	description: string;
	skillsRequired: Skill[];
	timeEstimation: [number, number];
}

export interface Idea extends NewIdea {
	id?: string;
	owner: { id: string; name: string };
	status: IdeaStatus;
	createdOn: firebase.firestore.Timestamp;
	assignedCount: number;
	likesCount: number;
	commentCount: number;
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
	owner: {
		id: string;
		name: string;
	};
	createdAt: fs.Timestamp;
	value: string;
}

import { firestore as fs } from "firebase/app";

///////////////// * Types * /////////////////
export type Skill = "Technical" | "Business" | "Project Manager" | "DMP" | "CDP";

export type Status = "Open" | "Active" | "Done" | "Blocked";

export type Scale = "Small" | "Medium" | "Large";

///////////////// * Users * /////////////////
export interface User {
	displayName: string;
	skills: Skill[];
}

export interface Owner {
	id: string;
	displayName: string;
	photoUrl?: string;
}

export interface UpdateUserSkills {
	skills: fs.FieldValue;
}

///////////////// * Ideas * /////////////////
export interface Idea extends IdeaNew {
	id?: string;
	owner: Owner;
	status: Status;
	createdAt: fs.Timestamp;
	assignedCount: number;
	likesCount: number;
	commentCount: number;
	tracking: number;
}

export interface IdeaNew {
	title: string;
	value: string;
	description: string;
	scale: Scale;
	skillsRequired: Skill[];
	timeEstimation: [number, number];
	projectCode?: string;
}

export interface IdeaUpdate {
	title?: string;
	value?: string;
	description?: string;
	status?: Status;
	scale?: Scale;
	skillsRequired?: fs.FieldValue;
	timeEstimation?: [number, number];
	tracking?: number;
}

///////////////// * Likes * /////////////////
export interface Like {
	owner: Owner;
	createdAt: fs.Timestamp;
	value: string;
}

////////////// * Assigments * //////////////
export interface Assignment {
	owner: Owner;
	createdAt: fs.Timestamp;
}

/////////////// * Comments * ///////////////
export interface Comment {
	owner: Owner;
	createdAt: fs.Timestamp;
	content: string;
}

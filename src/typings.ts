import { firestore as fs } from "firebase/app";

///////////////// * Types * /////////////////
export type Skill = "Technical" | "Business" | "Project Manager" | "DMP" | "CDP";

export type Status = "Open" | "Active" | "Finished" | "Blocked";

export type Difficulty = "Easy" | "Medium" | "Hard";

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
}

export interface IdeaNew {
	benefit: string;
	description: string;
	difficulty: Difficulty;
	skillsRequired: Skill[];
	timeEstimation: [number, number];
}

export interface IdeaUpdate {
	benefit?: string;
	description?: string;
	status?: Status;
	difficulty?: Difficulty;
	skillsRequired?: fs.FieldValue;
	timeEstimation?: [number, number];
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

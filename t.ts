import { db } from "./src/firebase";
import * as faker from "faker";
import * as AppTypes from "./src/typings";
import { firestore } from "firebase/app";

const skills = ["CDP", "DMP", "Project Manager", "Technical", "Business"];
const status = ["Open", "Active", "Done", "Blocked"];

let users = [];

let r = faker.random;

Array(20)
	.fill(0)
	.forEach(async () => {
		let newUser: any = {
			displayName: faker.name.findName(),
			skills: ["DMP", "CDP", "He he he"],
			photoUrl: faker.internet.avatar()
		};
		let id = (await db.collection("users").add(newUser)).id;
		users.push({ ...newUser, id });
	});

setTimeout(() => {
	Array(20)
		.fill(0)
		.forEach(async () => {
			const hours = r.number(10);

			let idea = await db.collection("ideas").add({
				assignedCount: 0,
				commentCount: 0,
				likeCount: 0,
				createdAt: firestore.Timestamp.now(),
				description: faker.lorem.paragraphs(3),
				owner: r.arrayElement(users),
				projectCode: r.boolean() ? r.word() : null,
				scale: r.arrayElement(["Small", "Medium", "Large"]),
				skillsRequired: [
					r.boolean() ? r.arrayElement(skills) : undefined,
					r.boolean() ? r.arrayElement(skills) : undefined,
					r.boolean() ? r.arrayElement(skills) : undefined,
					r.boolean() ? r.arrayElement(skills) : undefined,
					r.boolean() ? r.arrayElement(skills) : undefined
				].filter(el => el !== undefined),
				status: r.arrayElement(status),
				timeEstimation: [hours, hours + r.number(10)],
				value: faker.lorem.sentence(),
				tracking: r.number(100),
				title: r.words(r.number(5) + 2)
			} as AppTypes.Idea);

			Array(5)
				.fill(0)
				.forEach(() => {
					if (r.boolean()) {
						idea.collection("likes").add({
							createdAt: firestore.Timestamp.now(),
							owner: r.arrayElement(users),
							value: r.alphaNumeric()
						} as AppTypes.Like);
						idea.update({
							likeCount: firestore.FieldValue.increment(1)
						} as AppTypes.IdeaUpdate);
					}

					if (r.boolean()) {
						idea.collection("assigned").add({
							createdAt: firestore.Timestamp.now(),
							owner: r.arrayElement(users)
						} as AppTypes.Assignment);
						idea.update({
							assignedCount: firestore.FieldValue.increment(1)
						} as AppTypes.IdeaUpdate);
					}

					if (r.boolean()) {
						idea.collection("comments").add({
							createdAt: firestore.Timestamp.now(),
							owner: r.arrayElement(users),
							content: r.words(12 + r.number(10))
						} as AppTypes.Comment);
						idea.update({
							commentCount: firestore.FieldValue.increment(1)
						} as AppTypes.IdeaUpdate);
					}
				});
		});
}, 3000);

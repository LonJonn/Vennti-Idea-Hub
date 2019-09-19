declare module "model" {
	declare global {
		type Timestamp = firebase.firestore.Timestamp;
		type DocRef = firebase.firestore.DocumentReference;
		type QueryDoc = firebase.firestore.QueryDocumentSnapshot;
		type QuerySnap = firebase.firestore.QuerySnapshot;

		enum Skill {
			Technical,
			Business,
			ProjectManager,
			DMP,
			CDP
		}

		enum IdeaStatus {
			Open,
			Active,
			Solved,
			Blocked
		}

		enum IdeaDifficulty {
			Easy,
			Medium,
			Hard
		}
	}
}

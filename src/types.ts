export interface State {
	auth: {
		user: firebase.User | null;
		status: string | null;
		error: string | null;
	};
}

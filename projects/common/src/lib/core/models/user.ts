/** Basic representation of a user. */
export type User = Readonly<{

	/** ID. */
	id: number;

	/** First name. */
	firstName: string;

	/** Last name. */
	lastName: string;
}>;

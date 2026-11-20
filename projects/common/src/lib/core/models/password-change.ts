/** Password change data. */
export type PasswordChange = Readonly<{

	/** Current password. */
	password: string;

	/** New password. */
	newPassword: string;

	/** New password confirmation. */
	newPasswordConfirmation: string;
}>;

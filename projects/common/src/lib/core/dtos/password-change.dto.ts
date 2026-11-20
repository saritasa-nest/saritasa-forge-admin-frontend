/** Change password DTO. */
export type PasswordChangeDto = Readonly<{

	/** Old password. */
	old_password: string;

	/** New password. */
	new_password: string;

	/** Password that should duplicate new password. */
	new_password_confirm: string;
}>;

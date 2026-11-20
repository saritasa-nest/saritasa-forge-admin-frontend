export namespace PasswordResetDto {

	/** Data required to restore the password. */
	export type Data = Readonly<{

		/** Email to sent link for reset password. */
		email: string;
	}>;

	/** Reset password confirmation dto. */
	export type Confirmation = Readonly<{

		/** Password. */
		password: string;

		/** Password confirmation. */
		password_confirm: string;

		/** Unique user ID. */
		uid: string;

		/** Public token for changing the password. */
		token: string;
	}>;
}

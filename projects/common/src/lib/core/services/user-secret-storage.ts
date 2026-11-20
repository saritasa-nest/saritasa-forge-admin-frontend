import { Service } from '@angular/core';

import { injectStorage } from '../utils/storage';
import { type UserSecret, userSecretSchema } from '../models/user-secret';

const USER_SECRET_STORAGE_KEY = 'user';

/** User secret storage. */
@Service()
export class UserSecretStorageService {
	/** Current user secret. */
	public readonly currentSecret = injectStorage<UserSecret | null>(USER_SECRET_STORAGE_KEY, {
		parse: value => userSecretSchema.parse(JSON.parse(value)),
		defaultValue: null,
	});

	/**
	 * Saves a secret.
	 * @param secret Secret to save.
	 */
	public saveSecret(secret: UserSecret): UserSecret {
		this.currentSecret.set(secret);
		return secret;
	}

	/** Removes current secret. */
	public removeSecret(): void {
		this.currentSecret.set(null);
	}
}

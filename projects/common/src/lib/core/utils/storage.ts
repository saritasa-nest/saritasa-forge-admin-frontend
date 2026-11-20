import { inject, type Provider } from '@angular/core';
import { NGXTENSION_LOCAL_STORAGE, injectLocalStorage } from 'ngxtension/inject-local-storage';

import { WINDOW } from './window-token';

// Docs: https://ngxtension.dev/utilities/browser-apis/inject-local-storage/

/** Global provider for storage. `localStorage` is used as the underlying storage mechanism by default. */
export function provideStorage(): Provider {
	return {
		provide: NGXTENSION_LOCAL_STORAGE,
		useFactory: () => inject(WINDOW).localStorage,
	};
}

/**
 * Injects the global storage instance.
 * @example
 * ```ts
 * const username = injectStorage<string>('username');
 * username.set('John Doe');
 * username.update((name) => 'Guest ' + name);
 * effect(() => {
 *   console.log(username());
 * });
 * ```
 */
export const injectStorage = injectLocalStorage;

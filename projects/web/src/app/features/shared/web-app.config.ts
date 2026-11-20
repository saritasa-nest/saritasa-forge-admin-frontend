import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

import { AppConfig } from '@nf/common/core/services/app.config';

/** App-specific implementation of app config. */
@Injectable()
export class WebAppConfig extends AppConfig {
	private readonly document = inject(DOCUMENT);

	/** @inheritdoc */
	public readonly apiUrl = this.getApiUrl();

	/** @inheritdoc */
	public readonly version = this.getAppVersion();

	/**
	 * Provides app version with optional suffix.
	 */
	private getAppVersion(): string {
		return this.applySuffixIfPresent(
			this.applySuffixIfPresent(import.meta.env.NG_APP_VERSION, import.meta.env.NG_APP_COMMIT),
			import.meta.env.NG_APP_ENV,
		);
	}

	/**
	 * Provides the configured API base URL.
	 */
	private getApiUrl(): string {
		if (import.meta.env.NG_APP_USE_PROXY === 'true') {
			return `${this.document.location.origin}/api/`;
		}

		return import.meta.env.NG_APP_API_URL;
	}

	/**
	 * Applies a provided suffix if it's present.
	 * @param str Base string.
	 * @param suffix Suffix.
	 */
	private applySuffixIfPresent(str?: string, suffix?: string): string {
		if (str == null) {
			throw new Error(
				'Seems like NG_APP_VERSION is undefined. \
				Please make sure you\'ve provided a correct .env file that\'s specific to your environment',
			);
		}
		return str.concat(suffix ? `-${suffix}` : '');
	}
}

import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, type Observable } from 'rxjs';

import { type User } from '../models/user';
import { UserMapper } from '../mappers/user.mapper';
import { userDtoSchema } from '../dtos/user.dto';

import { AppUrlsConfig } from './app-urls.config';

/** Performs CRUD operations for users. */
@Service()
export class UserApiService {
	private readonly apiUrls = inject(AppUrlsConfig);

	private readonly httpClient = inject(HttpClient);

	/** Returns current user info.*/
	public getCurrentUser(): Observable<User> {
		return this.httpClient.get<unknown>(this.apiUrls.user.currentProfile).pipe(
			map(response => userDtoSchema.parse(response)),
			map(userDto => UserMapper.fromDto(userDto)),
		);
	}
}

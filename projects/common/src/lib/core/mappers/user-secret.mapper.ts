import { type UserSecret } from '../models/user-secret';
import { type UserSecretDto } from '../dtos/user-secret.dto';

/** User secret mapper. */
export namespace UserSecretMapper {
	export function toDto(model: UserSecret): UserSecretDto {
		return {
			token: model.token,
		};
	}

	export function fromDto(dto: UserSecretDto): UserSecret {
		return {
			token: dto.token,
		};
	}
}

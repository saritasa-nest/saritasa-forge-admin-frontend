import { type User } from '../models/user';
import { type UserDto } from '../dtos/user.dto';

/** User mapper. */
export namespace UserMapper {
	export function fromDto(dto: UserDto): User {
		return {
			firstName: dto.first_name,
			lastName: dto.last_name,
			id: dto.id,
		};
	}
}

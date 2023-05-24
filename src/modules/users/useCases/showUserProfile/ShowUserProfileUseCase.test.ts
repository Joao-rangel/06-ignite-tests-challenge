import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { User } from "../../entities/User";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

const usersRepository = { findById: jest.fn() };

describe('ShowUserProfileUseCase', () => {
	let service: ShowUserProfileUseCase;

	beforeEach(() => {
		service = new ShowUserProfileUseCase(
			usersRepository as unknown as IUsersRepository,
		);
	});

	test('Deve retornar erro se o usuário não existe', async () => {
		const testRequest = 'userId';
  
    await expect(service.execute(testRequest)).rejects.toBeInstanceOf(AppError);
	})

	test('Deve retornar o perfil do usuário', async () => {
		const testRequest = 'userId';

		const user: User = {
			id: testRequest,
			name: 'username',
			email: 'username@example.com',
			password: '123456',
			statement: [],
			created_at: new Date(),
			updated_at: new Date(),
		}

    usersRepository.findById.mockResolvedValueOnce(user);

		const testResult = await service.execute(testRequest);

		expect(testResult).toMatchObject(user);
	})
})
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

const usersRepository = {
	findByEmail: jest.fn(),
	create: jest.fn(obj => obj),
};

describe('CreateUserUseCase', () => {
	let service: CreateUserUseCase;

	beforeEach(() => {
		service = new CreateUserUseCase(
			usersRepository as unknown as IUsersRepository,
		);
	});

	test('Deve retornar erro se o email já existe', async () => {
		const testRequest: ICreateUserDTO = {
			name: 'testName',
			email: 'regisrered@test.com',
			password: '123456',
		};

		usersRepository.findByEmail.mockResolvedValueOnce({email: testRequest.email});
  
    await expect(service.execute(testRequest)).rejects.toBeInstanceOf(AppError);
	})

	test('Deve criar um novo usuário', async () => {
		const testRequest: ICreateUserDTO = {
			name: 'testName',
			email: 'user@test.com',
			password: '123456',
		};

		const testResult = await service.execute(testRequest);

		expect(testResult.name).toEqual(testRequest.name);
		expect(testResult.email).toEqual(testRequest.email);
		expect(testResult.password).not.toEqual(testRequest.password);
	})
})
import * as bcryptjs from 'bcryptjs';
import * as jsonwebtoken from 'jsonwebtoken';

import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

const usersRepository = { findByEmail: jest.fn(obj => obj) };

jest.mock('bcryptjs', () => ({ compare: jest.fn() }));
jest.mock('jsonwebtoken', () => ({ sign: jest.fn() }));

describe('AuthenticateUserUseCase', () => {
	let service: AuthenticateUserUseCase;

	beforeEach(() => {
		service = new AuthenticateUserUseCase(
			usersRepository as unknown as IUsersRepository,
		);
	});

	test('Deve retornar erro se o usuário não existe', async () => {
		const testRequest = {
			email: 'user@test.com',
			password: '123456',
		};
		
		usersRepository.findByEmail.mockResolvedValueOnce(undefined);
		
    await expect(service.execute(testRequest)).rejects.toBeInstanceOf(AppError);
	})

	test('Deve retornar erro se a senha não está correta', async () => {
		const testRequest = {
			email: 'user@test.com',
			password: '123456',
		};		

    await expect(service.execute(testRequest)).rejects.toBeInstanceOf(AppError);
	})

	test('Deve autenticar o usuário', async () => {
		const testRequest = {
			email: 'user@test.com',
			password: '123456',
		};

		(bcryptjs.compare as jest.Mock).mockResolvedValueOnce(true);
		(jsonwebtoken.sign as jest.Mock).mockReturnValueOnce('jwtToken');

		usersRepository.findByEmail.mockResolvedValueOnce(testRequest);

		const testResult = await service.execute(testRequest);

		expect(testResult.user.email).toEqual(testRequest.email);
		expect(testResult.token).toEqual('jwtToken');
	})
})
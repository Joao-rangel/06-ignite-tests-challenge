import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

const statementsRepository = {	getUserBalance: jest.fn()};
const usersRepository = { findById: jest.fn() };

describe('GetBalanceUseCase', () => {
	let service: GetBalanceUseCase;

	beforeEach(() => {
		service = new GetBalanceUseCase(
			statementsRepository as unknown as IStatementsRepository,
			usersRepository as unknown as IUsersRepository,
		);
	});

	test('Deve retornar erro se o usuário não existe', async () => {
		const testRequest = { user_id: 'userId' };
  
    await expect(service.execute(testRequest)).rejects.toBeInstanceOf(AppError);
	})

	test('Deve consultar o saldo do usuário', async () => {
		const testRequest = {
			user_id: 'userId',
		};

    const statementMock = {
      statement: [],
      balance: 99,
    };

    usersRepository.findById.mockResolvedValueOnce(testRequest);
    statementsRepository.getUserBalance.mockResolvedValueOnce(statementMock);

		const testResult = await service.execute(testRequest);

		expect(testResult).toMatchObject(statementMock);
	})
})
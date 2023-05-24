import { AppError } from "../../../../shared/errors/AppError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";

const usersRepository = { findById: jest.fn(obj => obj) };
const statementsRepository = {
	getUserBalance: jest.fn(),
	create: jest.fn(obj => obj),
};


describe('CreateStatementUseCase', () => {
	let service: CreateStatementUseCase;

	beforeEach(() => {
		service = new CreateStatementUseCase(
			usersRepository as unknown as IUsersRepository,
			statementsRepository as unknown as IStatementsRepository,
		);
	});

	test('Deve retornar erro se o usuário não existe', async () => {
		const testRequest = {
			user_id: 'userId',
			type: OperationType.DEPOSIT,
			amount: 99,
			description: 'testDepositFailure',
		};

		usersRepository.findById.mockResolvedValueOnce(undefined);
		
    await expect(service.execute(testRequest)).rejects.toBeInstanceOf(AppError);
	})
	
	test('Deve criar uma operação de depósito', async () => {
		const testRequest = {
			user_id: 'userId',
			type: OperationType.DEPOSIT,
			amount: 99,
			description: 'testDepositCompletion',
		};
		
		const testResult = await service.execute(testRequest);

		expect(testResult).toMatchObject(testRequest);
	})

	test('Deve criar uma operação de saque', async () => {
		const testRequest = {
			user_id: 'userId',
			type: OperationType.WITHDRAW,
			amount: 99,
			description: 'testDepositCompletion',
		};
		
		statementsRepository.getUserBalance.mockResolvedValueOnce({ balance: 100 });

		const testResult = await service.execute(testRequest);

		expect(testResult).toMatchObject(testRequest);
	})
	
	test('Deve retornar erro a conta não possuir saldo para saque', async () => {
		const testRequest = {
			user_id: 'userId',
			type: OperationType.WITHDRAW,
			amount: 99,
			description: 'testDepositCompletion',
		};

		statementsRepository.getUserBalance.mockResolvedValueOnce({ balance: 0 });

    await expect(service.execute(testRequest)).rejects.toBeInstanceOf(AppError);
	})
})
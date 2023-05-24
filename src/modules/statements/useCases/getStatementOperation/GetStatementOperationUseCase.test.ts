import { AppError } from "../../../../shared/errors/AppError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType, Statement } from "../../entities/Statement";

const usersRepository = { findById: jest.fn() };
const statementsRepository = { findStatementOperation: jest.fn() };

describe('GetStatementOperationUseCase', () => {
	let service: GetStatementOperationUseCase;

	beforeEach(() => {
		service = new GetStatementOperationUseCase(
			usersRepository as unknown as IUsersRepository,
			statementsRepository as unknown as IStatementsRepository,
		);
	});

	test('Deve retornar erro se o usuário não existe', async () => {
		const testRequest = {
			user_id: 'userId',
			statement_id: 'statementId',
		};
		
    await expect(service.execute(testRequest)).rejects.toBeInstanceOf(AppError);
	})

	test('Deve retornar erro se a operação não existe', async () => {
		const testRequest = {
			user_id: 'userId',
			statement_id: 'statementId',
		};
		
		usersRepository.findById.mockResolvedValueOnce({id: testRequest.user_id});

		await expect(service.execute(testRequest)).rejects.toBeInstanceOf(AppError);
	})

	test('Deve realizar a consulta e retornar a operação', async () => {
		const testRequest = {
			user_id: 'userId',
			statement_id: 'statementId',
		};

		const statement: Omit<Statement, 'user'> = {
			user_id: testRequest.user_id,
			description: 'description',
			amount: 99,
			type: OperationType.DEPOSIT,
			created_at: new Date(),
			updated_at: new Date(),
		}
		
		usersRepository.findById.mockResolvedValueOnce({id: testRequest.user_id});
		statementsRepository.findStatementOperation.mockResolvedValueOnce(statement);

		const testResult = await service.execute(testRequest);

		expect(testResult).toMatchObject(statement);
	})
})
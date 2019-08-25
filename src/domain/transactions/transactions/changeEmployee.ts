import { EmployeeRepository, EmployeeType, PaymentMethodRepository, PaymentMethodType } from "../../core";
import { Transaction } from "../Transaction";
import { buildTransactionValidator } from "../utils";

interface Dependencies {
    employeeRepository: EmployeeRepository;
    paymentMethodRepository: PaymentMethodRepository;
}
const transactionValidator = buildTransactionValidator("ChgEmp");

export function buildChangeEmployeeTransaction({
    employeeRepository,
    paymentMethodRepository
}: Dependencies): Transaction {
    return async function(id: string, updateType: string, ...params: string[]): Promise<void> {
        const employeeId = parseInt(id);

        if (updateType === "Name") return changeEmployeeName();
        if (updateType === "Address") return changeEmployeeAddress();
        if (updateType === "Hourly") return changeEmployeeTypeToHourly();
        if (updateType === "Salaried") return changeEmployeeTypeToSalaried();
        if (updateType === "Commissioned") return changeEmployeeTypeToCommissioned();
        if (updateType === "Hold") return changeEmployeePaymentMethodToHold();
        if (updateType === "Direct") return changeEmployeePaymentMethodToDirect();

        async function changeEmployeeName(): Promise<void> {
            const [name] = params;
            transactionValidator.assertIsNotEmpty(name);
            await employeeRepository.updateById(employeeId, { name });
        }

        async function changeEmployeeAddress(): Promise<void> {
            const [address] = params;
            transactionValidator.assertIsNotEmpty(address);
            return employeeRepository.updateById(employeeId, { address });
        }

        async function changeEmployeeTypeToHourly(): Promise<void> {
            const [hourlyRate] = params;
            transactionValidator.assertIsNotEmpty(hourlyRate);
            return employeeRepository.updateById(employeeId, {
                type: EmployeeType.HOURLY,
                hourlyRate: parseFloat(hourlyRate)
            });
        }

        async function changeEmployeeTypeToSalaried(): Promise<void> {
            const [monthlySalary] = params;
            transactionValidator.assertIsNotEmpty(monthlySalary);
            return employeeRepository.updateById(employeeId, {
                type: EmployeeType.SALARIED,
                monthlySalary: parseFloat(monthlySalary)
            });
        }

        async function changeEmployeeTypeToCommissioned(): Promise<void> {
            const [monthlySalary, commissionRate] = params;
            transactionValidator.assertIsNotEmpty(monthlySalary);
            transactionValidator.assertIsNotEmpty(commissionRate);
            return employeeRepository.updateById(employeeId, {
                type: EmployeeType.COMMISSIONED,
                monthlySalary: parseFloat(monthlySalary),
                commissionRate: parseFloat(commissionRate)
            });
        }

        async function changeEmployeePaymentMethodToHold(): Promise<void> {
            await paymentMethodRepository.deleteByEmployeeId(employeeId);
            return paymentMethodRepository.insertOne({
                type: PaymentMethodType.HOLD,
                employeeId: employeeId
            });
        }

        async function changeEmployeePaymentMethodToDirect(): Promise<void> {
            const [bank, account] = params;
            transactionValidator.assertIsNotEmpty(bank);
            transactionValidator.assertIsNotEmpty(account);
            await paymentMethodRepository.deleteByEmployeeId(employeeId);
            return paymentMethodRepository.insertOne({
                type: PaymentMethodType.DIRECT,
                employeeId: employeeId,
                account,
                bank
            });
        }
    };
}

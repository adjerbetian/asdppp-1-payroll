import { executePayrollCommand, expect, generateIndex, seeders } from "@test/e2e";
import {
    dbPaymentMethods,
    dbUnionMembers,
    DirectPaymentMethod,
    Employee,
    MailPaymentMethod,
    NotFoundError,
    PaymentMethod,
    PaymentMethodType,
    UnionMember
} from "../app";

describe("Use Case 6: Changing Employee Details", () => {
    let employee: Employee;

    beforeEach(async () => {
        employee = await seeders.seedHourlyEmployee();
    });

    describe("payment method", () => {
        describe("Hold", () => {
            it("should set the employee's payment method", async () => {
                await executePayrollCommand(`ChgEmp ${employee.getId()} Hold`);

                const dbPaymentMethod = await fetchPaymentMethodByEmployeeId(employee.getId());
                expect(dbPaymentMethod.getType()).to.equal(PaymentMethodType.HOLD);
            });
            it("should change the employee's payment method if one existed", async () => {
                await seeders.seedDirectPaymentMethod({ employeeId: employee.getId() });

                await executePayrollCommand(`ChgEmp ${employee.getId()} Hold`);

                const dbPaymentMethod = await fetchPaymentMethodByEmployeeId(employee.getId());
                expect(dbPaymentMethod.getType()).to.equal(PaymentMethodType.HOLD);
            });
        });
        describe("Direct", () => {
            it("should set the employee's payment method", async () => {
                await executePayrollCommand(`ChgEmp ${employee.getId()} Direct "bank-id" "account-id"`);

                const dbPaymentMethod = (await fetchPaymentMethodByEmployeeId(employee.getId())) as DirectPaymentMethod;
                expect(dbPaymentMethod.getType()).to.equal(PaymentMethodType.DIRECT);
                expect(dbPaymentMethod.getBank()).to.equal("bank-id");
                expect(dbPaymentMethod.getAccount()).to.equal("account-id");
            });
            it("should change the employee's payment method if one existed", async () => {
                await seeders.seedHoldPaymentMethod({ employeeId: employee.getId() });

                await executePayrollCommand(`ChgEmp ${employee.getId()} Direct "bank-id" "account-id"`);

                const dbPaymentMethod = (await fetchPaymentMethodByEmployeeId(employee.getId())) as DirectPaymentMethod;
                expect(dbPaymentMethod.getType()).to.equal(PaymentMethodType.DIRECT);
            });
            it("should do nothing when the account is missing", async () => {
                await executePayrollCommand(`ChgEmp ${employee.getId()} Direct "bank-id"`);

                const promise = fetchPaymentMethodByEmployeeId(employee.getId());
                await expect(promise).to.be.rejectedWith(NotFoundError);
            });
        });
        describe("Mail", () => {
            it("should set the employee's payment method", async () => {
                await executePayrollCommand(`ChgEmp ${employee.getId()} Mail "my address"`);

                const dbPaymentMethod = (await fetchPaymentMethodByEmployeeId(employee.getId())) as MailPaymentMethod;
                expect(dbPaymentMethod.getType()).to.equal(PaymentMethodType.MAIL);
                expect(dbPaymentMethod.getAddress()).to.equal("my address");
            });
            it("should change the employee's payment method if one existed", async () => {
                await seeders.seedHoldPaymentMethod({ employeeId: employee.getId() });

                await executePayrollCommand(`ChgEmp ${employee.getId()} Mail "my address"`);

                const dbPaymentMethod = (await fetchPaymentMethodByEmployeeId(employee.getId())) as MailPaymentMethod;
                expect(dbPaymentMethod.getType()).to.equal(PaymentMethodType.MAIL);
            });
            it("should do nothing when the address is missing", async () => {
                await executePayrollCommand(`ChgEmp ${employee.getId()} Mail `);

                const promise = fetchPaymentMethodByEmployeeId(employee.getId());
                await expect(promise).to.be.rejectedWith(NotFoundError);
            });
        });
    });
    describe("Union", () => {
        describe("Member", () => {
            it("should put the employee in Union", async () => {
                await executePayrollCommand(`ChgEmp ${employee.getId()} Member member-123 Dues 10.5`);

                const unionMember = await fetchUnionMemberByEmployeeId(employee.getId());
                expect(unionMember.getMemberId()).to.equal("member-123");
                expect(unionMember.getRate()).to.equal(10.5);
            });
            it("should do nothing if the employee does not exist", async () => {
                const nonExistingId = generateIndex();
                await executePayrollCommand(`ChgEmp ${nonExistingId} Member member-123 Dues 10.5`);

                const promise = fetchUnionMemberByEmployeeId(nonExistingId);
                await expect(promise).to.be.rejectedWith(NotFoundError);
            });
            it("should do nothing if the dues rate is not defined", async () => {
                await executePayrollCommand(`ChgEmp ${employee.getId()} Member member-123 Dues`);

                const promise = fetchUnionMemberByEmployeeId(employee.getId());
                await expect(promise).to.be.rejectedWith(NotFoundError);
            });
            it("should do nothing when the member id is already used", async () => {
                const alreadyUsedUnionMember = await seeders.seedUnionMember();

                await executePayrollCommand(
                    `ChgEmp ${employee.getId()} Member ${alreadyUsedUnionMember.getMemberId()} Dues 20`
                );

                const promise = fetchUnionMemberByEmployeeId(employee.getId());
                await expect(promise).to.be.rejectedWith(NotFoundError);
            });
        });
        describe("NoMember", () => {
            it("should remove the employee from Union", async () => {
                await seeders.seedUnionMember({ employeeId: employee.getId() });

                await executePayrollCommand(`ChgEmp ${employee.getId()} NoMember`);

                const promise = fetchUnionMemberByEmployeeId(employee.getId());
                await expect(promise).to.be.rejectedWith(NotFoundError);
            });
        });
    });
});

async function fetchPaymentMethodByEmployeeId(employeeId: number): Promise<PaymentMethod> {
    return dbPaymentMethods.fetch({ employeeId });
}
async function fetchUnionMemberByEmployeeId(employeeId: number): Promise<UnionMember> {
    return await dbUnionMembers.fetch({ employeeId });
}

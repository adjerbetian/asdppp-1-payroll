import { Employee, mongoEmployeeRepository } from "../src";
import { executePayrollCommand, expect } from "../test/e2eTest";
import { generateCommissionedEmployee, generateHourlyEmployee, generateSalariedEmployee } from "../test/generators";

describe("Use Case 1: Add New Employee", () => {
    it("should add an hourly employee", async () => {
        const employee = generateHourlyEmployee();

        await executePayrollCommand(
            `AddEmp ${employee.id} "${employee.name}" "${employee.address}" H ${employee.hourlyRate}`
        );

        await expectUserToExistInDb(employee);
    });
    it("should add a salaried employee", async () => {
        const employee = generateSalariedEmployee();

        await executePayrollCommand(
            `AddEmp ${employee.id} "${employee.name}" "${employee.address}" S ${employee.monthlySalary}`
        );

        await expectUserToExistInDb(employee);
    });
    it("should add a salaried employee with a monthly commission rate", async () => {
        const employee = generateCommissionedEmployee();

        await executePayrollCommand(
            `AddEmp ${employee.id} "${employee.name}" "${employee.address}" C ${employee.monthlySalary} ${employee.commissionRate}`
        );

        await expectUserToExistInDb(employee);
    });
    it("should do nothing when the transaction is wrongly put", async () => {
        const employee = generateCommissionedEmployee();

        await executePayrollCommand(
            `AddEmp ${employee.id} "${employee.name}" "${employee.address}" C ${employee.monthlySalary}`
        );

        const employeeExistsInDb = await mongoEmployeeRepository.exists({ id: employee.id });
        expect(employeeExistsInDb).to.be.false;
    });
});

async function expectUserToExistInDb(employee: Employee): Promise<void> {
    const dbEmployee = await mongoEmployeeRepository.fetchById(employee.id);
    expect(dbEmployee).to.deep.equal(employee);
}

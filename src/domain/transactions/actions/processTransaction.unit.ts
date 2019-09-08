import {
    buildStubFor,
    entityGenerators,
    expect,
    generateIndex,
    generateSalesReceipt,
    generateServiceCharge,
    Stub
} from "@test/unit";
import { isoDate } from "../../../utils";
import { makeProcessTransaction, Transactions } from "./processTransaction";

describe("processTransaction", () => {
    let processTransaction: ReturnType<typeof makeProcessTransaction>;
    let stubbedTransactions: Stub<Transactions>;

    beforeEach(() => {
        stubbedTransactions = buildStubTransactions();
        processTransaction = makeProcessTransaction(stubbedTransactions);
    });

    describe("AddEmp", () => {
        it("should call the addEmployee transaction", async () => {
            stubbedTransactions.addEmployee.resolves();
            const employee = entityGenerators.generateHourlyEmployee();

            await processTransaction([
                "AddEmp",
                `${employee.getId()}`,
                `"${employee.getName()}"`,
                `"${employee.getAddress()}"`,
                "H",
                `${employee.getHourlyRate()}`
            ]);

            expect(stubbedTransactions.addEmployee).to.have.been.calledOnceWith(
                `${employee.getId()}`,
                `"${employee.getName()}"`,
                `"${employee.getAddress()}"`,
                "H",
                `${employee.getHourlyRate()}`
            );
        });
    });
    describe("DelEmp", () => {
        it("should call the deleteEmployee transaction", async () => {
            stubbedTransactions.deleteEmployee.resolves();
            const employeeId = generateIndex();

            await processTransaction(["DelEmp", `${employeeId}`]);

            expect(stubbedTransactions.deleteEmployee).to.have.been.calledOnceWith(`${employeeId}`);
        });
    });
    describe("TimeCard", () => {
        it("should call the postTimeCard transaction", async () => {
            stubbedTransactions.postTimeCard.resolves();
            const timeCard = entityGenerators.generateTimeCard();

            await processTransaction([
                "TimeCard",
                `${timeCard.getEmployeeId()}`,
                `${timeCard.getDate()}`,
                `${timeCard.getHours()}`
            ]);

            expect(stubbedTransactions.postTimeCard).to.have.been.calledOnceWith(
                `${timeCard.getEmployeeId()}`,
                `${timeCard.getDate()}`,
                `${timeCard.getHours()}`
            );
        });
    });
    describe("SalesReceipt", () => {
        it("should call the postSalesReceipt transaction", async () => {
            stubbedTransactions.postSalesReceipt.resolves();
            const salesReceipt = generateSalesReceipt();

            await processTransaction([
                "SalesReceipt",
                `${salesReceipt.employeeId}`,
                `${salesReceipt.date}`,
                `${salesReceipt.amount}`
            ]);

            expect(stubbedTransactions.postSalesReceipt).to.have.been.calledOnceWith(
                `${salesReceipt.employeeId}`,
                `${salesReceipt.date}`,
                `${salesReceipt.amount}`
            );
        });
    });
    describe("ServiceCharge", () => {
        it("should call the postServiceCharge transaction", async () => {
            stubbedTransactions.postServiceCharge.resolves();
            const serviceCharge = generateServiceCharge();

            await processTransaction(["ServiceCharge", `${serviceCharge.memberId}`, `${serviceCharge.amount}`]);

            expect(stubbedTransactions.postServiceCharge).to.have.been.calledOnceWith(
                `${serviceCharge.memberId}`,
                `${serviceCharge.amount}`
            );
        });
    });
    describe("ChgEmp", () => {
        it("should call the changeEmployee transaction", async () => {
            stubbedTransactions.changeEmployee.resolves();
            const employeeId = generateIndex();

            await processTransaction(["ChgEmp", `${employeeId}`, "Name", "James Bond"]);

            expect(stubbedTransactions.changeEmployee).to.have.been.calledOnceWith(
                `${employeeId}`,
                "Name",
                "James Bond"
            );
        });
    });
    describe("Payroll", () => {
        it("should call the runPayroll transaction", async () => {
            stubbedTransactions.runPayroll.resolves();
            const date = isoDate();

            await processTransaction(["Payroll", `${date}`]);

            expect(stubbedTransactions.runPayroll).to.have.been.calledOnceWith(`${date}`);
        });
    });
});

export function buildStubTransactions(): Stub<Transactions> {
    return buildStubFor({
        addEmployee: true,
        deleteEmployee: true,
        postTimeCard: true,
        postSalesReceipt: true,
        postServiceCharge: true,
        changeEmployee: true,
        runPayroll: true
    });
}

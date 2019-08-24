import * as moment from "moment";
import {
    buildFakeEmployeeRepository,
    buildFakeTimeCardRepository,
    Fake
} from "../../../test/fakeBuilders";
import {
    generateCommissionedEmployee,
    generateSalariedEmployee,
    generateSalesReceipt
} from "../../../test/generators";
import { expect } from "../../../test/unitTest";
import { SalesReceipt } from "../entities";
import { EmployeeTypeError, TransactionFormatError } from "../errors";
import { EmployeeRepository, TimeCardRepository } from "../repositories";
import { buildPostSalesReceiptTransaction } from "./postSalesReceipt";
import { Transaction } from "./Transactions";

describe("postTimeCard", () => {
    let fakeSalesReceiptRepository: Fake<TimeCardRepository>;
    let fakeEmployeeRepository: Fake<EmployeeRepository>;
    let postSalesReceipt: Transaction;

    beforeEach(() => {
        fakeSalesReceiptRepository = buildFakeTimeCardRepository();
        fakeEmployeeRepository = buildFakeEmployeeRepository();
        postSalesReceipt = buildPostSalesReceiptTransaction({
            salesReceiptRepository: fakeSalesReceiptRepository,
            employeeRepository: fakeEmployeeRepository
        });

        fakeSalesReceiptRepository.insertOne.resolves();
    });

    it("should create a sales receipt for the employee", async () => {
        const salesReceipt = generateSalesReceipt();
        fakeEmployeeRepository.fetchById
            .withArgs(salesReceipt.employeeId)
            .resolves(generateCommissionedEmployee());

        await postSalesReceiptEntity(salesReceipt);

        expect(fakeSalesReceiptRepository.insertOne).to.have.been.calledOnceWith(salesReceipt);
    });
    it("should throw a EmployeeTypeError if the employee is not a commissioned employee", async () => {
        const salesReceipt = generateSalesReceipt();
        fakeEmployeeRepository.fetchById
            .withArgs(salesReceipt.employeeId)
            .resolves(generateSalariedEmployee());

        // noinspection ES6MissingAwait
        const promise = postSalesReceiptEntity(salesReceipt);

        await expect(promise).to.be.rejectedWith(EmployeeTypeError);
    });
    it("should throw a TransactionFormatError if the amount is missing", async () => {
        const salesReceipt = generateSalesReceipt();
        fakeEmployeeRepository.fetchById
            .withArgs(salesReceipt.employeeId)
            .resolves(generateCommissionedEmployee());

        // noinspection ES6MissingAwait
        const promise = postSalesReceipt(`${salesReceipt.employeeId}`, `${salesReceipt.date}`, ``);

        await expect(promise).to.be.rejectedWith(TransactionFormatError, "SalesReceipt");
    });
    it("should throw a TransactionFormatError if the date is not in the right format", async () => {
        const salesReceipt = generateSalesReceipt({ date: moment().format("DD-MM-YYYY") });
        fakeEmployeeRepository.fetchById
            .withArgs(salesReceipt.employeeId)
            .resolves(generateCommissionedEmployee());

        // noinspection ES6MissingAwait
        const promise = postSalesReceipt(
            `${salesReceipt.employeeId}`,
            `${salesReceipt.date}`,
            `${salesReceipt.amount}`
        );

        await expect(promise).to.be.rejectedWith(TransactionFormatError, "SalesReceipt");
    });

    async function postSalesReceiptEntity(salesReceipt: SalesReceipt): Promise<void> {
        return postSalesReceipt(
            `${salesReceipt.employeeId}`,
            `${salesReceipt.date}`,
            `${salesReceipt.amount}`
        );
    }
});

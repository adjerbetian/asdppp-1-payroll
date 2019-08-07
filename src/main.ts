import { buildApp } from "./app";
import { buildTransactions } from "./core";
import {
    closeConnection,
    mongoEmployeeRepository,
    initConnection,
    mongoSalesReceiptRepository,
    mongoServiceChargeRepository,
    mongoTimeCardRepository
} from "./mongo";
import { buildProcessTransaction } from "./processTransaction";

const transactions = buildTransactions({
    salesReceiptRepository: mongoSalesReceiptRepository,
    employeeRepository: mongoEmployeeRepository,
    serviceChargeRepository: mongoServiceChargeRepository,
    timeCardRepository: mongoTimeCardRepository
});
const processTransaction = buildProcessTransaction(transactions);
const app = buildApp({ initConnection, closeConnection, processTransaction });

// eslint-disable-next-line @typescript-eslint/no-floating-promises
app.run().then(() => console.log("done"));

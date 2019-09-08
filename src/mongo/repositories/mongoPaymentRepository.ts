import * as moment from "moment";
import { Payment, PaymentDependencies } from "../../domain";
import { isoDate } from "../../utils";
import { MongoDbAdapter } from "../databases";

const NEVER = isoDate(moment(0));

export function makeMongoPaymentRepository(db: MongoDbAdapter<Payment>): PaymentDependencies["paymentRepository"] {
    return {
        async fetchLastOfEmployee(employeeId) {
            return db.fetchLast({ employeeId });
        },
        async fetchEmployeeLastPaymentDate(employeeId) {
            if (await db.exists({ employeeId })) {
                const payment = await db.fetchLast({ employeeId });
                return payment.date;
            } else {
                return NEVER;
            }
        },
        async insert(payment) {
            await db.insert(payment);
        }
    };
}

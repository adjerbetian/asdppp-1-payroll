import { generateIndex } from "@test/generators";
import * as _ from "lodash";
import * as moment from "moment";
import {
    DirectPaymentMethod,
    HoldPaymentMethod,
    isoDate,
    MailPaymentMethod,
    Payment,
    PaymentMethodType,
    SalesReceipt,
    ServiceCharge
} from "../../src";

export function generateSalesReceipt(args: Partial<SalesReceipt> = {}): SalesReceipt {
    const index = generateIndex();
    return {
        employeeId: index,
        date: moment().format("YYYY-MM-DD"),
        amount: generateFloatBetween(10000, 50000),
        ...args
    };
}

export function generateServiceCharge(args: Partial<ServiceCharge> = {}): ServiceCharge {
    const index = generateIndex();
    return {
        memberId: `member-${index}`,
        amount: generateFloatBetween(2, 10),
        ...args
    };
}

export function generateFloatBetween(min: number, max: number): number {
    return _.round(_.random(min, max, true), 2);
}

export function generateHoldPaymentMethod(args: Partial<HoldPaymentMethod> = {}): HoldPaymentMethod {
    const index = generateIndex();
    return {
        type: PaymentMethodType.HOLD,
        employeeId: index,
        ...args
    };
}

export function generateDirectPaymentMethod(args: Partial<DirectPaymentMethod> = {}): DirectPaymentMethod {
    const index = generateIndex();
    return {
        type: PaymentMethodType.DIRECT,
        employeeId: index,
        account: `account-${index}`,
        bank: `bank-${index}`,
        ...args
    };
}

export function generateMailPaymentMethod(args: Partial<MailPaymentMethod> = {}): MailPaymentMethod {
    const index = generateIndex();
    return {
        type: PaymentMethodType.MAIL,
        employeeId: index,
        address: `address-${index}`,
        ...args
    };
}

export function generatePayment(args: Partial<Payment> = {}): Payment {
    return {
        amount: generateFloatBetween(1000, 2000),
        employeeId: generateIndex(),
        date: isoDate(),
        method: generateHoldPaymentMethod(),
        ...args
    };
}

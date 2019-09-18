import { buildServiceCharge, CoreActions } from "../../../domain";
import { Transactions } from "../../processTransaction";
import { buildTransactionValidator } from "../utils";

const transactionValidator = buildTransactionValidator("ServiceCharge");

export function makePostServiceChargeTransaction(actions: CoreActions): Transactions["postServiceCharge"] {
    return async function(memberId, amount) {
        assertTransactionValid(memberId, amount);

        const serviceCharge = buildServiceCharge({
            memberId,
            amount: parseFloat(amount)
        });
        await actions.createServiceCharge(serviceCharge);
    };

    function assertTransactionValid(memberId: string, amount: string): void {
        transactionValidator.assertIsNotEmpty(memberId);
        transactionValidator.assertIsNotEmpty(amount);
    }
}

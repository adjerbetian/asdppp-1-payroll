import { CoreActions } from "../../../domain";
import { Controllers } from "../../Controllers";
import { buildTransactionValidator } from "../utils";

const transactionValidator = buildTransactionValidator("ServiceCharge");

export function makePostServiceChargeTransaction(actions: CoreActions): Controllers["postServiceCharge"] {
    return async function(memberId, amount) {
        assertTransactionValid(memberId, amount);

        await actions.createServiceCharge({
            memberId,
            amount: parseFloat(amount)
        });
    };

    function assertTransactionValid(memberId: string, amount: string): void {
        transactionValidator.assertIsNotEmpty(memberId);
        transactionValidator.assertIsNotEmpty(amount);
    }
}

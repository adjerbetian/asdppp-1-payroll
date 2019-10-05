import { monday } from "@bobs-payroll/common";
import { generators, expect, generateIndex, Stub } from "../../../../../../test/unit";
import { TimeCardRepository } from "../../repositories";
import { buildStubbedTimeCardRepository } from "../../test";
import { makeFetchEmployeeTimeCardsSince } from "./fetchAllOfEmployeeSince";

describe("use case - fetchAllOfEmployeeSince", () => {
    let stubbedTimeCardRepository: Stub<TimeCardRepository>;
    let fetchEmployeeTimeCardsSince: ReturnType<typeof makeFetchEmployeeTimeCardsSince>;

    beforeEach(() => {
        stubbedTimeCardRepository = buildStubbedTimeCardRepository();
        fetchEmployeeTimeCardsSince = makeFetchEmployeeTimeCardsSince({
            timeCardRepository: stubbedTimeCardRepository
        });
    });

    it("should return the time cards", async () => {
        const timeCards = [generators.generateTimeCard(), generators.generateTimeCard()];
        const employeeId = generateIndex();
        stubbedTimeCardRepository.fetchAllOfEmployeeSince.withArgs(employeeId, monday).resolves(timeCards);

        const result = await fetchEmployeeTimeCardsSince(employeeId, monday);

        expect(result).to.deep.equal(timeCards);
    });
});

import { UnionMembership } from "@modules/core";
import { generators, seeders } from "@modules/core/test";
import { Given } from "cucumber";
import { store, toFloat } from "../../utils";

Given(
    /^a( new)? union membership(?: (\w+))? for (\w+)(?: with the member id (\w+))?(?: (?:with|and) a rate of (\d+\.?\d*))?$/,
    async (
        isNew: string | null,
        membershipName: string | null,
        employeeName: string,
        memberId: string | null,
        rate: string | null
    ) => {
        const unionMembership = await seedOrGenerate();
        if (membershipName) {
            store.unionMembers.set(membershipName, unionMembership);
        }

        async function seedOrGenerate(): Promise<UnionMembership> {
            const partialUnionMembership = {
                employeeId: getEmployeeId(),
                memberId: memberId || undefined,
                rate: toFloat(rate)
            };

            if (isNew) return generators.generateUnionMembership(partialUnionMembership);
            else return await seeders.seedUnionMembership(partialUnionMembership);
        }
        function getEmployeeId(): number {
            const employee = store.employees.get(employeeName);
            return employee.getId();
        }
    }
);

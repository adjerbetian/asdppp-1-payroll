import { execute, expect } from "../test/e2eTest";
import { db } from "../src/db";
import { ObjectID } from "bson";

describe("Use Case 1: Add New Employee", () => {
    const employee = {
        id: 12345,
        name: "employee name",
        address: "55 Rue du Faubourg Saint-Honoré, 75008 Paris"
    };

    it("should add an employee with a hourly rate", async () => {
        await executePayrollCommand(
            `AddEmp ${employee.id} "${employee.name}" "${employee.address}" H 2`
        );

        const dbEmployee = await fetchEmployee(employee.id);
        expect(dbEmployee).to.deep.equal({
            id: employee.id,
            name: employee.name,
            address: employee.address,
            rateType: "hourly",
            rate: 2
        });
    });
});

async function executePayrollCommand(command: string): Promise<string> {
    return execute("node dist/index.js " + command);
}

async function fetchEmployee(id: number): Promise<DBEmployee | null> {
    return await db.collection("employees").findOne({ id });
}

interface DBEmployee {
    _id: ObjectID;
    id: number;
    name: string;
    address: string;
    rateType: string;
    rate: number;
}

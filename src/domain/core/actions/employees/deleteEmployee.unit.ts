import { expect, generateIndex, Stub } from "@test/unit";
import { EmployeeRepository } from "../../repositories";
import { buildStubbedEmployeeRepository } from "../../test";
import { makeDeleteEmployee } from "./deleteEmployee";

describe("action deleteEmployee", () => {
    let stubbedEmployeeRepository: Stub<EmployeeRepository>;
    let deleteEmployee: ReturnType<typeof makeDeleteEmployee>;

    beforeEach(() => {
        stubbedEmployeeRepository = buildStubbedEmployeeRepository();
        deleteEmployee = makeDeleteEmployee({
            employeeRepository: stubbedEmployeeRepository
        });
    });

    it("should delete the employee", async () => {
        stubbedEmployeeRepository.deleteById.resolves();
        const employeeId = generateIndex();

        await deleteEmployee(employeeId);

        expect(stubbedEmployeeRepository.deleteById).to.have.been.calledOnceWith(employeeId);
    });
});

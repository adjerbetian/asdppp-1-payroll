import { SalariedEmployee } from "../../entities";
import { EmployeeRepository } from "../../repositories";
import { CoreEmployeeActions } from "../CoreActions";

interface Dependencies {
    employeeRepository: EmployeeRepository;
}

export function makeFetchAllSalariedEmployees({
    employeeRepository
}: Dependencies): CoreEmployeeActions["fetchAllSalariedEmployees"] {
    return async function(): Promise<SalariedEmployee[]> {
        return employeeRepository.fetchAllSalaried();
    };
}

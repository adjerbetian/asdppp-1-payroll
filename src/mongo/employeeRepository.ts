import { Employee } from "../entities";
import { dbEmployees } from "./db";
import { FilterQuery } from "mongodb";
import { NotFoundError } from "../errors";
import { EmployeeRepository } from "../repositories";

export const employeeRepository: EmployeeRepository = {
    async fetchEmployeeById(id: number): Promise<Employee> {
        return fetchIt({ id });
    },
    async insertOne(employee: Employee): Promise<void> {
        await dbEmployees.insertOne(employee);
        // @ts-ignore
        delete employee._id;
    },
    async exists(query: Partial<Employee>): Promise<boolean> {
        return !!(await dbEmployees.findOne(query, { projection: { _id: 1 } }));
    },
    async deleteById(id: number): Promise<void> {
        const a = await dbEmployees.deleteOne({ id });
        if (a.deletedCount === 0) {
            throw new NotFoundError(`the employee ${id} does not exist`);
        }
    }
};

async function fetchIt(query: FilterQuery<Employee>): Promise<Employee> {
    const employee = await dbEmployees.findOne(query);
    if (!employee) {
        throw new NotFoundError(`no employee matching ${JSON.stringify(query)} was found`);
    }
    delete employee._id;
    return employee;
}

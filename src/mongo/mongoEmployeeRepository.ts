import { FilterQuery } from "mongodb";
import { Employee, EmployeeRepository, NotFoundError } from "../core";
import { dbEmployees } from "./db";
import { cleanMongoEntity } from "./utils";

export const mongoEmployeeRepository: EmployeeRepository = {
    async fetchById(id: number): Promise<Employee> {
        return fetchByQuery({ id });
    },
    async fetchByMemberId(memberId: string | undefined): Promise<Employee> {
        if (!memberId) throw new NotFoundError(`the memberId is not defined`);
        return fetchByQuery({ memberId });
    },
    async insertOne(employee: Employee): Promise<void> {
        await dbEmployees.insertOne(employee);
        cleanMongoEntity(employee);
    },
    async exists(query: Partial<Employee>): Promise<boolean> {
        return !!(await dbEmployees.findOne(query, { projection: { _id: 1 } }));
    },
    async deleteById(id: number): Promise<void> {
        const a = await dbEmployees.deleteOne({ id });
        if (a.deletedCount === 0) throw new NotFoundError(`the employee ${id} does not exist`);
    },
    async updateById(id: number, update: Partial<Employee>): Promise<void> {
        const { matchedCount } = await dbEmployees.updateOne({ id }, { $set: update });
        if (matchedCount === 0) throw new NotFoundError(`the employee ${id} does not exist`);
    }
};

async function fetchByQuery(query: FilterQuery<Employee>): Promise<Employee> {
    const employee = await dbEmployees.findOne(query);
    if (!employee) {
        throw new NotFoundError(`no employee matching ${JSON.stringify(query)} was found`);
    }
    return cleanMongoEntity(employee);
}

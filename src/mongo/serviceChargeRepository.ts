import { ServiceChargeRepository } from "../repositories";
import { dbServiceCharge } from "./db";
import { cleanMongoEntity } from "./utils";
import { ServiceCharge } from "../entities";

export const serviceChargeRepository: ServiceChargeRepository = {
    async fetchAllOfEmployee(employeeId: number): Promise<ServiceCharge[]> {
        const timeCards = await dbServiceCharge.find({ employeeId }).toArray();
        return timeCards.map(e => cleanMongoEntity(e));
    },
    async insertOne(serviceCharge: ServiceCharge) {
        await dbServiceCharge.insertOne(serviceCharge);
        cleanMongoEntity(serviceCharge);
    }
};

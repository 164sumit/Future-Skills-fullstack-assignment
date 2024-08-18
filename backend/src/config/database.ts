import { DataSource } from "typeorm"
import { Card } from "../entities/Card.js"


export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    entities: [Card],
    synchronize: true,
    logging: false
})
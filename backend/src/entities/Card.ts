import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Card {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ unique: true })
    title: string

    @Column()
    description: string
}
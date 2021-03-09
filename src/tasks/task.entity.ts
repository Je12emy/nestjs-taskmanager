import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "./task-status.enum";


@Entity()
export class Task extends BaseEntity{
    @PrimaryGeneratedColumn() // This is a primary auto_incremt column
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: TaskStatus
}
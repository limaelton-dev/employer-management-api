import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ContactInfo } from "./contact-info.entity";

@Entity('employee')
export class Employee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => Employee, { onDelete: 'SET NULL' })
    @JoinColumn()
    manager: Employee;

    @Column({ nullable: true })
    managerId?: number | null;

    @OneToOne(() => ContactInfo, { cascade: true })
    @JoinColumn()
    contactInfo?: ContactInfo
}
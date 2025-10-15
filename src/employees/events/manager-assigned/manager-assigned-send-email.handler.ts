import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ManagerAssignedEvent } from "./manager-assigned.event";
import { DataSource } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { Employee } from "../../entities/employee.entity";

@EventsHandler(ManagerAssignedEvent)
export class ManagerAssigned_SendEmailHandler implements IEventHandler<ManagerAssignedEvent> {
    constructor(
        @InjectDataSource()
        private readonly dataSourece: DataSource
    ) {}

    async handle(event: ManagerAssignedEvent) {
        const manager = await this.dataSourece.manager.findOne(Employee, {
            where: { id: event.managerId },
            relations: ['contactInfo']
        })

        //não tem como mandar email
        if(!manager?.contactInfo?.email) return;

        const employee = await this.dataSourece.manager.findOne(Employee, {
            where: { id: event.employeeId },
        })

        //send email simulation
        setTimeout(() => {
            console.log(`
                Sending email to ${manager.contactInfo!.email} 
                with body 
                    '${employee?.name} joined their team'`);
        }, 4000);
    }

}
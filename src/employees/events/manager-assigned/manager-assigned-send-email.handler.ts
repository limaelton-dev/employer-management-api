import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ManagerAssignedEvent } from "./manager-assigned.event";
import { DataSource } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { Employee } from "../../entities/employee.entity";
import { Job, Queue } from "bull";
import { InjectQueue, Process, Processor } from "@nestjs/bull";

@EventsHandler(ManagerAssignedEvent)
@Processor('employees')
export class ManagerAssigned_SendEmailHandler implements IEventHandler<ManagerAssignedEvent> {
    constructor(
        @InjectDataSource()
        private readonly dataSourece: DataSource,
        @InjectQueue('employees')
        private readonly queue: Queue
    ) {}
    async handle(event: ManagerAssignedEvent) {
        await this.queue.add('manager-assing-send-email', event)
    }

    @Process('manager-assing-send-email')
    async process(job: Job<ManagerAssignedEvent>) {
        console.log(`Attemp #${job.attemptsMade}`);
        const event = job.data;
        const manager = await this.dataSourece.manager.findOne(Employee, {
            where: { id: event.managerId },
            relations: ['contactInfo']
        })

        //não tem como mandar email
        if(!manager?.contactInfo?.email) return;

        const employee = await this.dataSourece.manager.findOne(Employee, {
            where: { id: event.employeeId },
        })

        if(job.attemptsMade === 0) throw new Error('Failed to send email');
        
        //send email simulation
        setTimeout(() => {
            console.log(`
                Sending email to ${manager.contactInfo!.email} 
                with body 
                    '${employee?.name} joined their team'`);
        }, 1000);
    }

}
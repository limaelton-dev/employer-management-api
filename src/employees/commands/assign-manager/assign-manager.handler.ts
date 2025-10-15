import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { AssignManagerCommand } from "./assign-manager.command";
import { DataSource } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { Employee } from "src/employees/entities/employee.entity";
import { ManagerAssignedEvent } from "src/employees/events/manager-assigned/manager-assigned.event";

@CommandHandler(AssignManagerCommand)
export class AssignManagerHandler implements ICommandHandler <AssignManagerCommand, number> {
    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
        private readonly eventBus: EventBus
    ) {}

    async execute(command: AssignManagerCommand): Promise<number> {
        return await this.dataSource.transaction(async (db) => {
            const employee = await db.findOne(Employee, {
                where: { id: command.id }
            })
            if(!employee) return 0;

            const isNewManager = command.managerId && command.managerId !== employee.managerId;

            employee.managerId = command.managerId ?? null;
            await db.save(Employee, employee)

            //publicar o evento
            if(isNewManager) {
                await this.eventBus.publish(
                    new ManagerAssignedEvent(employee.id, employee.managerId!),
                );
            }

            return 1;
        })
    }

}

import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../task.model";

export class TaskStatusValidationPipe implements PipeTransform {
    
    readonly allowedStatuses = [
        TaskStatus.OPEN,
        TaskStatus.DONE,
        TaskStatus.IN_PROGRESS
    ]
    
    transform(value: any) {
        // throw new Error("Method not implemented.");
        value = value.toUpperCase();
    
        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`${value} is as invalid status`);
        }

        return value;
    }

    private isStatusValid(status: any) {
        const index = this.allowedStatuses.indexOf(status);
        return index !== -1;
    }

}
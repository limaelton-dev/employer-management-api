import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { ProcessPaymentDto } from "./dtos/process-payment.dto";

@Processor('webhooks')
export class WebhooksConsumer {
    constructor() {}

    @Process('process-payment')
    processPayment(job: Job<ProcessPaymentDto>) {
        console.log(`Attemp #${job.attemptsMade}`);

        if(job.attemptsMade === 0) throw new Error('Failed to process payment on the first attempt');
        
        //processamento aqui...
        console.log('Payment webhook received', job.data)
    }
}
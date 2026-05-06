import { Module } from "@nestjs/common";
import { TicketController } from "./tickets.controller";
import { TicketService } from "./tickets.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}

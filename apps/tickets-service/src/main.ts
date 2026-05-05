import { NestFactory } from "@nestjs/core";
import { TicketsServiceModule } from "./tickets-service.module";
import { ValidationPipe } from "@nestjs/common";
import { SERVICES_PORT } from "@app/common";

async function bootstrap() {
  const app = await NestFactory.create(TicketsServiceModule);
  // USE VALIDATION
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(SERVICES_PORT.TICKETS_SERVICE);
  console.log(
    `Ticket service is running on port ${SERVICES_PORT.TICKETS_SERVICE}`,
  );
}
bootstrap();

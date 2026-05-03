import { NestFactory } from "@nestjs/core";
import { EventsServiceModule } from "./events-service.module";
import { ValidationPipe } from "@nestjs/common";
import { SERVICES_PORT } from "@app/common";
import * as dotenv from "dotenv";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(EventsServiceModule);
  // USE VALIDATION
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(SERVICES_PORT.EVENT_SERVICE);
  console.log(
    `Event service is running on port ${SERVICES_PORT.EVENT_SERVICE}`,
  );
}
bootstrap();

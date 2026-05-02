import { NestFactory } from "@nestjs/core";
import { AuthServiceModule } from "./auth-service.module";
import * as dotenv from "dotenv";
import { SERVICES_PORT } from "@app/common";
import { ValidationPipe } from "@nestjs/common";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);

  // USE VALIDATION
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(SERVICES_PORT.AUTH_SERVICE);
  console.log(`Auth service is running on port ${SERVICES_PORT.AUTH_SERVICE}`);
}
bootstrap();

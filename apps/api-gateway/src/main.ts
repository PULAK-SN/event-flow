import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { SERVICES_PORT } from "@app/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // USE VALIDATION
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(SERVICES_PORT.API_GATEWAY);
  console.log(`API Gateway is running on port :${SERVICES_PORT.API_GATEWAY}`);
}
bootstrap();

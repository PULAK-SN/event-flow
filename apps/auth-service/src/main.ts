import { NestFactory } from "@nestjs/core";
import { AuthServiceModule } from "./auth-service.module";
import * as dotenv from "dotenv";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();

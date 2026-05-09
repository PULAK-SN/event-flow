import { NestFactory } from "@nestjs/core";
import { NotificationsServiceModule } from "./notifications-service.module";
import * as dotenv from "dotenv";
import { KAFKA_BROKER, KAFKA_CLIENT_ID } from "@app/kafka";
import { SERVICES_PORT } from "@app/common";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(NotificationsServiceModule);

  // connect kafka microservice to consume the events
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: `${KAFKA_CLIENT_ID}-notifications`,
        brokers: [KAFKA_BROKER],
      },
      consumer: {
        groupId: "notifications-consumer-group",
      },
    },
  });

  // start microservice (kafka consumer)
  await app.startAllMicroservices();
  await app.listen(SERVICES_PORT.NOTIFICATION_SERVICE);
  console.log(
    `Notification service is running on port ${SERVICES_PORT.NOTIFICATION_SERVICE}`,
  );
  console.log("Notification service is running");
}
bootstrap();

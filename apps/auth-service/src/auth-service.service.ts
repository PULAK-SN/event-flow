import { KAFKA_SERVICE, KAFKA_TOPICS } from "@app/kafka";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

@Injectable()
export class AuthServiceService implements OnModuleInit {
  constructor(
    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    // connect to kafka when initializes
    await this.kafkaClient.connect();
  }
  getHello(): string {
    return "Hello World!";
  }

  // simulateUserRegistration(email: string) {
  //   // publish event to kafka
  //   this.kafkaClient.emit(KAFKA_TOPICS.USER_REGISTERED, {
  //     email,
  //     timeStamp: new Date().toISOString(),
  //   });

  //   return { message: `User registered ${email}` };
  // }

  async simulateUserRegistration(email: string) {
    try {
      // We use lastValueFrom because emit returns an Observable
      await lastValueFrom(
        this.kafkaClient.emit(KAFKA_TOPICS.USER_REGISTERED, {
          email,
          timeStamp: new Date().toISOString(),
        }),
      );

      console.log(
        `Successfully published to topic: ${KAFKA_TOPICS.USER_REGISTERED}`,
      );
      return { message: `User registered ${email}` };
    } catch (err) {
      console.error("Failed to publish to Kafka:", err);
      throw err;
    }
  }
}

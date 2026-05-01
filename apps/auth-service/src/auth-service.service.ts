import { DatabaseService, users } from "@app/database";
import { KAFKA_SERVICE, KAFKA_TOPICS } from "@app/kafka";
import {
  ConflictException,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ClientKafka } from "@nestjs/microservices";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
// import { lastValueFrom } from "rxjs";

@Injectable()
export class AuthServiceService implements OnModuleInit {
  constructor(
    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
    private readonly dbService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    // connect to kafka when initializes
    await this.kafkaClient.connect();
  }

  // async simulateUserRegistration(email: string) {
  //   try {
  //     // We use lastValueFrom because emit returns an Observable
  //     await lastValueFrom(
  //       this.kafkaClient.emit(KAFKA_TOPICS.USER_REGISTERED, {
  //         email,
  //         timeStamp: new Date().toISOString(),
  //       }),
  //     );

  //     console.log(
  //       `Successfully published to topic: ${KAFKA_TOPICS.USER_REGISTERED}`,
  //     );
  //     return { message: `User registered ${email}` };
  //   } catch (err) {
  //     console.error("Failed to publish to Kafka:", err);
  //     throw err;
  //   }
  // }

  async register(name: string, email: string, password: string) {
    // check if user exists
    const existingUser = await this.dbService.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0)
      throw new ConflictException("User already exist");

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const [user] = await this.dbService.db
      .insert(users)
      .values({ email, password: hashedPassword, name })
      .returning();

    // emit user register event
    this.kafkaClient.emit(KAFKA_TOPICS.USER_REGISTERED, {
      userId: user.id,
      email: user.email,
      timestamp: new Date().toISOString(),
    });

    return { message: "User registered successfully", userId: user.id };
  }

  async login(email: string, password: string) {
    const [user] = await this.dbService.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException("Invalid credentials");

    const token = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { secret: process.env.JWT_SECRET },
    );

    this.kafkaClient.emit(KAFKA_TOPICS.USER_LOGIN, {
      userId: user.id,
      timestamp: new Date().toISOString(),
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async getProfile(userId: string) {
    const [user] = await this.dbService.db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return user;
  }
}

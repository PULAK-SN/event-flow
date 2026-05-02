import { SERVICES_PORT } from "@app/common";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return `API_WATEWAY is running on port ${SERVICES_PORT.API_GATEWAY}`;
  }
}

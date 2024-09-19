import { Observable } from "rxjs";
import { ClientService } from "./app.resolver";

export function initializeApplication(clientService: ClientService) {
  return (): any => {
    return clientService.checkAuthenticatedStatus();
  }
}


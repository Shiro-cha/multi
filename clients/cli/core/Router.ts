import { exit } from "process";
import { Service } from "typedi";

type Controller = (...args: any[]) => Promise<number>;

interface Route {
  eventName: string;
  controller: Controller;
}

@Service()
export class Router {
  private routes: Route[] = [];

  public  addRoute(eventName: string, controller: Controller): void {
    this.routes.push({ eventName, controller });
  }

  public removeRoute(eventName: string): void {
    this.routes = this.routes.filter(route => route.eventName !== eventName);
  }

  public async triggerEvent(eventName: string, ...args: any[]): Promise<number> {
    const route = this.routes.find(route => route.eventName === eventName);
    
    if (route) {
      return await route.controller(...args);
    } else {
      console.warn(`Action '${eventName}' not found`);
      return 1;
    }
  }
}


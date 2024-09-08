import { Service } from "typedi";

type EventController = (...args: any[]) => void;

interface EventRoute {
  eventName: string;
  controller: EventController;
}

@Service()
export class EventRouter {
  private routes: EventRoute[] = [];

  public addRoute(eventName: string, controller: EventController): void {
    this.routes.push({ eventName, controller });
  }

  public removeRoute(eventName: string): void {
    this.routes = this.routes.filter(route => route.eventName !== eventName);
  }

  public triggerEvent(eventName: string, ...args: any[]): void {
    const route = this.routes.find(route => route.eventName === eventName);
    if (route) {
      route.controller(...args);
    } else {
      console.warn(`No controller found for event '${eventName}'`);
    }
  }
}


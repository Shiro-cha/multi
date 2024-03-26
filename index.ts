import { MulticastEvent } from "./event/MulticastEvent";
import { router } from "./eventRouters/router";

const event = new MulticastEvent(router)
event.listen();




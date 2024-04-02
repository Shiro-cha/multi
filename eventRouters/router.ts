import { SystemController } from "../controllers/SystemController";
import { EventRouter } from "../event/RouterEvent";

const router = new EventRouter();
const {init} = new SystemController();

router.addRoute("/hello-world",init);

export {
    router
}
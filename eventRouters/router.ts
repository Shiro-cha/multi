import { SearchController } from "../controllers/SearchController";
import { SystemController } from "../controllers/SystemController";
import { EventRouter } from "../event/RouterEvent";

const router = new EventRouter();
const {init} = new SystemController();
const {search,found} = new SearchController();

router.addRoute("/hello-world",init);
router.addRoute("/search",search);
router.addRoute("/found",found);

export {
    router
}
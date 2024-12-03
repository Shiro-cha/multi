import { CLIController } from "../controllers/CLIController";
import { Router } from "../core/Router";

const router = new Router();
const {edit,create,resend,remove,info,showAllSearch,quit} = new CLIController();

router.addRoute('e',edit);
router.addRoute('c',create);
router.addRoute('r',resend);
router.addRoute('d',remove);
router.addRoute('i',info);
router.addRoute('s',showAllSearch);
router.addRoute('q',quit);


export {router};
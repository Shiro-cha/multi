import { config } from "dotenv";
import { System } from "./facades/System";
import { SearchFacade } from "./facades/Search";
import { Network } from "./core/Network";
import { IdentityFacade } from "./facades/Idenity";

config();
const system = new System();
const search = new SearchFacade();
const identity = new IdentityFacade();
const network = new Network();

system.init();
identity.update("Shiro Yami")
// search.create({name:"Test",content:[]});
// search.resend();

// console.log(search.getAll());



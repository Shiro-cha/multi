
import { System } from "./facades/System";
import { SearchFacade } from "./facades/Search";
import { Network } from "./core/Network";
import { IdentityFacade } from "./facades/Idenity";
import { ChatFacade } from "./facades/Chat";
import { AppEvent } from "./core/AppEvent";

const system = new System();
const search = new SearchFacade();
const identity = new IdentityFacade();
const network = new Network();
const chat = new ChatFacade();

system.init();
identity.update("Shiro y");
search.create({name:"Teste",content:[{keys:["Halsey"],extension:".mp3"}]});





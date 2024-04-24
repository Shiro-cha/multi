import { config } from "dotenv";
import { System } from "./facades/System";
import { SearchFacade } from "./facades/Search";
import { Network } from "./core/Network";
import { IdentityFacade } from "./facades/Idenity";
import { ChatFacade } from "./facades/Chat";

config();
const system = new System();
const search = new SearchFacade();
const identity = new IdentityFacade();
const network = new Network();
const chat = new ChatFacade();

system.init();
identity.update("Nomena Fitiavana")
search.create({name:"Test",content:[]});
search.resend();

// chat.new("7d771af668c6d81f8d0bf3539bdb2e2a","hello world");





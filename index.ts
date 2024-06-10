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
identity.update("Shiro Yami")
search.create({name:"Test",content:[]});
search.resend();
chat.new("edf5c923df3de39eb23291200027a01f","hello world");





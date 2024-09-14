
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
identity.update("Shiro Yami");
search.create({name:"Teste",content:[{keys:["bad at love"],extension:".mp3"}]});
// await search.resend();
await search.delete("b0392ffee156ca704d88abda5bde7cfc");
// chat.new("edf5c923df3de39eb23291200027a01f","hello world");

const evt = AppEvent.create();

evt.on("hello").then(function(){
    console.log("hello event");
})

setTimeout(function(){
    evt.emit("hello");
},2000)





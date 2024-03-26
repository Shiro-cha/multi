import { EventRouter } from "./RouterEvent";


export class MulticastEvent{
    constructor(
        private routerEvent:EventRouter
    ){}
    
    listen():void{
        
        this.routerEvent.triggerEvent("/hello",{});
    }
    
    stop():void{
        console.log("Stoped!!!");
    }
}

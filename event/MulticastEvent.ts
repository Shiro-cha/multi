import { Socket } from "node:dgram";
import { Listener } from "../core/Listener";
import { IMessage } from "../types/IMessage";
import { EventRouter } from "./RouterEvent";


export class MulticastEvent{
    constructor(
        private routerEvent:EventRouter,
        private listener:Listener
    ){}
    
    listen(callback:(error:Error|null)=>void ):void{
        try {
            this.listener.listen((message: IMessage, rinfo: any,socket:Socket|null) =>{
                const data = {...message,rinfo,socket}
                this.routerEvent.triggerEvent(message.label,data);
            })
            callback(null);
        } catch (error) {
            callback(new Error("unkown error"))
        }
    }
    
    stop():void{
        console.log("Stoped!!!");
    }
}

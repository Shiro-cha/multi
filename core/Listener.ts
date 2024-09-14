import { Service } from "typedi";
import { IMessage } from "../types/IMessage";
import { Multicast } from "./Multicast";
import { Socket } from "node:dgram";



@Service()
export class Listener{
    constructor(
      private server:Multicast
    ){ }


    listen(callback:(message:IMessage,rinfo:any,socket:Socket|null)=>void):void{
        this.server.getSocket()?.on('listening', () => {
     
          this.server.getSocket()?.on('message', (msgBuffer:Buffer, rinfo:any) => {
            const message = JSON.parse(msgBuffer.toString()) as IMessage;
            callback(message, rinfo,this.server.getSocket());
          });
          
        });
    }

    
}
import {Socket} from "node:dgram";
import { Service } from "typedi";
import { IMessage } from "../types/IMessage";

@Service()
export class Request{
    constructor(
        private socket:Socket
    ){}

    send(address:string="127.0.0.1",port:number,message:IMessage){
        
        const messageBuffer = Buffer.from(JSON.stringify(message));
        this.socket.send(messageBuffer,0, messageBuffer.length,port,address)
    }
}
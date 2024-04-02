import { exit } from "node:process";
import { Listener } from "../core/Listener";
import { Multicast } from "../core/Multicast";
import { Request } from "../core/Request";
import { MulticastEvent } from "../event/MulticastEvent";
import { router } from "../eventRouters/router";

export class System{

    private multicastAddress:string | undefined;
    private multicastport:number;
    constructor(){
        this.multicastAddress = process.env.MULTICAST_ADDRESS;
        this.multicastport = parseInt(process.env.MULTICAST_PORT||"");
    }
    
    
    init():void{
        
            const server = Multicast.createServer(this.multicastAddress,this.multicastport);
            const listener = new Listener(server);
            const event = new MulticastEvent(router,listener);

            event.listen((error)=>{
                if(error) throw error;
                console.log(`listening...`);
                
            });

            const socket = server.getSocket();
            if(socket){
                const request = new Request(socket);
                request.send(this.multicastAddress,this.multicastport,{label:"/hello-world",data:"hello world"})
            }
        
    }
    stop():void{
        exit(0);
    }
}
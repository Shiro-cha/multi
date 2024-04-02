import dgram, {Socket} from "node:dgram";
import { Service } from "typedi";
import { IMessage } from "../types/IMessage";



@Service()
export class Multicast{
    static instance:Multicast;
    private constructor(
      private udpClient: Socket |null = null,
      private multicastAddress: string = "127.0.0.1",
      private port: number = 5000,
    ){ }

    static createServer(multicastAddress:string="127.0.0.1",port:number=5000):Multicast{
      if(Multicast.instance){
        return Multicast.instance;
      }
    
      const udpClient = dgram.createSocket({ type: 'udp4', reuseAddr: true });
      udpClient?.bind(port,() =>{
        try {
          udpClient?.addMembership(multicastAddress)
        } catch (error) {
          multicastAddress = "127.0.0.1";
          port=5000;
          console.error("Impossible to join the multicast group, listening on ",multicastAddress+":"+port);
        }
      
      });
      Multicast.instance = new Multicast(udpClient,multicastAddress,port);
      Multicast.instance.multicastAddress = multicastAddress;
      Multicast.instance.port = port;

      return Multicast.instance;
    }

    getSocket(){
      return this.udpClient;
    }
    getAddress(){
      return this.multicastAddress;
    }
    getPort(){
      return this.port;
    }

    
}
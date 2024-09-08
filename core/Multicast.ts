import dgram, {Socket} from "node:dgram";
import { Service } from "typedi";
import { IMessage } from "../types/IMessage";
import { Network } from "./Network";



@Service()
export class Multicast{
    static instance:Multicast;
    private constructor(
      private useInterface:string,
      private udpClient: Socket |null = null,
      private multicastAddress: string = "127.0.0.1",
      private port: number = 5000,
    ){ }

    static createServer(multicastAddress:string="127.0.0.1",port:number=5000):Multicast{
      if(Multicast.instance){
        return Multicast.instance;
      }
      const interfaces = new Network().getInterfaces();
      const useInterface = interfaces.length > 0 ? interfaces[0]:"lo"
      const udpClient = dgram.createSocket({ type: 'udp4', reuseAddr: true });
      udpClient?.bind(port,() =>{
        try {
          udpClient?.addMembership(multicastAddress)
        } catch (error) {
          console.log(error);
          
          multicastAddress = "127.0.0.1";
          port=5000;
          console.error("Impossible to join the multicast group, listening on ",multicastAddress+":"+port);
        }
      
      });
      Multicast.instance = new Multicast(useInterface,udpClient,multicastAddress,port);
      Multicast.instance.multicastAddress = multicastAddress;
      Multicast.instance.port = port;

      return Multicast.instance;
    }
    static getConnexion(){
      return Multicast.instance
    }

    getUseInterface(){
      return this.useInterface;
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
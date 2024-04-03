import { Database } from "../../core/Database";
import { Multicast } from "../../core/Multicast";
import { Network } from "../../core/Network";
import { Idenity } from "../../entity/Idenity";


export class IdentityService{

    init(server:Multicast){
        const repository = Database.getRepository();
        const networkInfo = new Network().getIpv4Info(server.getUseInterface())
        let identity = new Idenity();
        identity = repository.getDataByIndex(0,identity);
        if(!identity && networkInfo){
            const manager = Database.getManager();
            
            identity = new Idenity();
            identity
            .setname(networkInfo?.address)
            .setphysicalAddress(networkInfo.mac)
            .setipv4(networkInfo.address);

            manager.create(identity);
            
        }    
         
        
    }
}
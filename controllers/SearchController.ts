import { Socket } from "dgram";
import { Request } from "../core/Request";
import { IdentityFacade } from "../facades/Idenity";
import { SearchService } from "../services/search/SearchService";
import { Idenity } from "../entity/Idenity";
import { Database } from "../core/Database";
import { Search } from "../entity/Search";

export class SearchController{

    search(body:{data:any,socket:Socket,rinfo:any}){
        const searchBody = body.data;
        const identity = new IdentityFacade().get();
        const request = new Request(body.socket);
        const remoteAddress = body.rinfo.address;
        const remotePort = body.rinfo.port;
        
        request.send(remoteAddress,remotePort,{label:"/found",data:{identity,search:searchBody}})
        
        
    }
    found(body:{data:any,socket:Socket,rinfo:any}){
        const manager = Database.getManager();
        const repository = Database.getRepository();
        const slug = body.data.search.slug;
        const identity = new Idenity().set(body.data.identity);
        const search = repository.getBySlug(slug,new Search());
        search?.addfounders(identity);
        manager.update(slug,search);
        
        console.log("Search name:",search?.getslug(),"found by:",identity.getname());    
    }
}
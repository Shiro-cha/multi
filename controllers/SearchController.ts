import { Socket } from "dgram";
import chalk from "chalk";
import { Request } from "../core/Request";
import { IdentityFacade } from "../facades/Idenity";
import { SearchService } from "../services/search/SearchService";
import { Idenity } from "../entity/Idenity";
import { Database } from "../core/Database";
import { Search } from "../entity/Search";
import { Factory } from "../contexts/Factory";
import { AppEvent } from "../core/AppEvent";

export class SearchController{

    search(body:{data:any,socket:Socket,rinfo:any}){
        const searchBody = body.data;
        const identity = new IdentityFacade().get();
        const request = new Request(body.socket);
        const remoteAddress = body.rinfo.address;
        const remotePort = body.rinfo.port;
        //TODO: implement search
        const searcherContext = Factory.create("file");
        
        const results = searcherContext?.search(searchBody.content[0]);
        if(results?.length && results.length > 0){
            request.send(remoteAddress,remotePort,{label:"/found",data:{identity,search:searchBody}})
        }
        
        
    }
    found(body:{data:any,socket:Socket,rinfo:any}){
        const manager = Database.getManager();
        const repository = Database.getRepository();
        const slug = body.data.search.slug;
        const identity = new Idenity().set(body.data.identity);
        const search = repository.getBySlug(slug,new Search());
        search?.addfounders(identity);
        manager.update(slug,search);
        
        //TODE: Emit an event to tel that somemone phone something
        console.log("\nSearch name: ", chalk.blueBright(search?.getname()),"found by:",identity.getname());  
        AppEvent.create().emit("found");  
    }
}
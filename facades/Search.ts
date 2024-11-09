import { MD5 } from "bun";
import { Database } from "../core/Database";
import { Multicast } from "../core/Multicast";
import { Request } from "../core/Request";
import { Search } from "../entity/Search";
import { IdentityFacade } from "./Idenity";
import { randomBytes, randomInt } from "crypto";



export class SearchFacade{
    private manager = Database.getManager();
    private repository = Database.getRepository();

    create(searchBody:{name:string,content:any[]}){
        const newSearch = new Search();
        const identity  = new IdentityFacade().get();
        
        const slug = this.generateHash().toString();
        newSearch
        .setname(searchBody.name)
        .setcontent(searchBody.content)
        .setstatus("requesting")
        .setsearcher(identity);
        this.manager.create(newSearch);
        
        this.makeRequest(newSearch);
        
    }

    resend(){
        console.log("resend.....");
        
        const searchs = this.getAll();
        const current = this;
        searchs.forEach((search):void=>{
            current.makeRequest(search);
        });
    }

    getAll(){
        const search = new Search();
        const searchs:Search[] = this.repository.getAllData(search);
        return searchs;
    }

    getByStatus(status:"requesting" | "found" | "discard"){
        const searchs = this.getAll().filter((value:Search) =>value.getstatus()===status);
        return searchs;
    }

    changeStatus(slug:string,status:"requesting" | "found" | "discard"){
        let search = new Search();
        search = this.repository.getBySlug(slug,search) as Search
        if(search){
            search.setstatus(status);
            return this.manager.update(slug,search);
        }
        return null;
    }

    delete(slug:string){
        console.log("delete....");
        
        const search = new Search();
        this.manager.delete(slug,search);
    }


    private makeRequest(newSearch:Search){
        const server = Multicast.getConnexion();
        
        
        const socket = server.getSocket();
        if(!socket){
            throw "Failed to connect"
        }
        
        const request = new Request(socket);
        request.send(server.getAddress(),server.getPort(),{label:"/search",data:newSearch})
    }
    private generateHash(){
        const randomize = randomBytes(16);
        const hash = randomize.toString("hex")
        return hash;
    }
}
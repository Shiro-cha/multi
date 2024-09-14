import { Database } from "../core/Database";
import { Multicast } from "../core/Multicast";
import { Request } from "../core/Request";
import { Chat } from "../entity/Chat";
import { Idenity } from "../entity/Idenity";
import { IdentityFacade } from "./Idenity";

export class ChatFacade{
    private repository = Database.getRepository();
    private manager = Database.getManager();
    new(user_id:string,message:string="",name:string|null=null){
        const currentUser = new IdentityFacade().get();
        const user = this.repository.getBySlug(user_id,new Idenity()) as Idenity | null;
        if(!user){
            throw "User not found";
        }
        const newChat = new Chat();
        newChat.setname(name || user.getname())
        .setuser(user)
        .adddiscussion({user:currentUser,content:[message]})
        .setstatus("active");
        
        this.manager.create(newChat);
        this.makeRequest(newChat,user.getipv4());
        

    }

    private makeRequest(newChat:Chat,address:string|null){
        const server = Multicast.getConnexion();

        const socket = server.getSocket();
        if(socket){
            const request = new Request(socket);
            request.send(address || server.getAddress(),server.getPort(),{label:"/chat",data:newChat})
        }
    }
}
import { hash } from "bun";
import { Entity } from "../core/Entity";
import { Idenity } from "./Idenity";

type Discussion = {user:Idenity,content:string[]};

export class Chat extends Entity{

    private name:string | null=null;
    private user:Idenity|null = null;
    private discussion:Discussion[] = [];
    private status:"active"|"disabled"="disabled";

    
    
    public getname = ():string | null =>{
        return this.name;
    }
    
    public setname = (name:string|null):Chat=>{
        this.name = name;

        return this;
    }
    public getuser = ():Idenity | null =>{
        return this.user;
    }
    public setuser = (user:Idenity):Chat =>{
        this.user = user;
        return this;
    }
    public getdiscussion = ():Discussion[]=>{
        return this.discussion;
    }
    public adddiscussion = (discussion:Discussion):Chat=>{
        this.discussion.push(discussion);
        return this;
    }
    public setdiscussion = (discussions:Discussion[]):Chat=>{
        this.discussion = discussions;
        return this;
    }
    public getstatus = ():"active"|"disabled"=>{
        return this.status
    }
    public setstatus = (status:"active"|"disabled"):Chat=>{
        this.status = status;
        return this;
    }
   


    public set(entries:{ slug:string,user:{ slug:string,name:string, physicalAddress:string | null, ipv4:string | null},name:string,discussion: any[], status: "active"|"disabled" ,searcher:{ slug:string,name:string, physicalAddress:string | null, ipv4:string | null},founders:{ slug:string,name:string, physicalAddress:string | null, ipv4:string | null}[]}):Entity{
        this.slug = entries.slug;
        console.log("entries",entries.user);
        
        this.user = new Idenity();
        this.user = this.user.set(entries.user);
        this.name = entries.name,
        this.discussion = entries.discussion.map((entry)=>{return {...entry,user:new Idenity().set(entry.user)}});;
        this.status = entries.status;
        return this;
    }
    public  getEntityName():string{
        return "chat";
    }

    create(): Entity {
        return new Chat();
    }
    
}
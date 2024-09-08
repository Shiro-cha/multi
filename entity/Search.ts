import { hash } from "bun";
import { Entity } from "../core/Entity";
import { Idenity } from "./Idenity";

export class Search extends Entity{

    private name:string | null=null;
    private content:any[] = [];
    private status:"requesting"|"found"|"discard"="requesting";
    private searcher:Idenity|null = null;
    private founders:Idenity[]=[];

    public getname = ():string | null =>{
        return this.name;
    }
    
    public setname = (name:string|null):Search=>{
        this.name = name;

        return this;
    }
    public getcontent = ():any[]=>{
        return this.content;
    }
    public addcontent = (content:any):Search=>{
        this.content.push(content);
        return this;
    }
    public setcontent = (contents:any[]):Search=>{
        this.content = contents;
        return this;
    }
    public getstatus = ():"requesting"|"found"|"discard"=>{
        return this.status
    }
    public setstatus = (status:"requesting"|"found"|"discard"):Search=>{
        this.status = status;
        return this;
    }
    public  getsearcher():Idenity|null{
        return this.searcher;
    }
    public setsearcher(searcher:Idenity):Search{
        this.searcher = searcher;
        return this;
    }
    public getfounders = ():any[]=>{
        return this.founders;
    }
    public addfounders = (founder:Idenity):Search=>{
        const existing = this.founders.filter((value)=>value.getslug()===founder.getslug())
        if(existing.length === 0){
            this.founders.push(founder);
        }
        return this;
    }
    public setfounders = (founders:any[]):Search=>{
        this.founders = founders;
        return this;
    }


    public set(entries:{ slug:string,name:string, content: any[], status: "requesting"|"found"|"discard" ,searcher:{ slug:string,name:string, physicalAddress:string | null, ipv4:string | null},founders:{ slug:string,name:string, physicalAddress:string | null, ipv4:string | null}[]}):Entity{
        this.slug = entries.slug;
        this.name = entries.name,
        this.content = entries.content;
        this.status = entries.status;
        this.searcher = new Idenity();
        this.searcher.set(entries.searcher);
        this.founders = entries.founders.map((entry)=>new Idenity().set(entry));
        return this;
    }
    public  getEntityName():string{
        return "search";
    }

    create(): Entity {
        return new Search();
    }
    
}
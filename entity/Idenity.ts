import { Entity } from "../core/Entity";

export class Idenity extends Entity{
    private name:string | null=null;
    private physicalAddress:string | null=null;
    private ipv4:string | null=null;


    public getname = ():string | null =>{
        return this.name;
    }
    
    public setname = (name:string|null):Idenity=>{
        this.name = name;
        return this;
    }
    public getphysicalAddress = ():string | null =>{
        return this.physicalAddress;
    }
    
    public setphysicalAddress = (physicalAddress:string|null):Idenity=>{
        this.physicalAddress = physicalAddress;

        return this;
    }

    public getipv4 = ():string | null =>{
        return this.ipv4;
    }
    
    public setipv4 = (ipv4:string|null):Idenity=>{
        this.ipv4 = ipv4;

        return this;
    }


    public set(entries:{ slug:string,name:string, physicalAddress:string | null, ipv4:string | null}):Idenity{
        this.slug = entries.slug;
        this.name = entries.name,
        this.physicalAddress = entries.physicalAddress;
        this.ipv4 = entries.ipv4;
        return this;
    }
    public  getEntityName():string{
        return "identity";
    }
    create(): Entity {
        return new Idenity();
    }
    
}
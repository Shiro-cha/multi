import { randomBytes } from "crypto";

export abstract class Entity{
    abstract getEntityName():string;
    abstract set(entries:any):any;
    abstract create():Entity;

    public slug:string = "";

    public getslug():string{
        return this.slug;
    }
    public setslug():Entity{
        this.slug = this.generateHash();
        return this;
    }

    private generateHash(){
        const randomize = randomBytes(16);
        const hash = randomize.toString("hex")
        return hash;
    }

    private getMethods(){

    }
    // getPropreties(){
    //     const currentEnity = new Object(this);
    //     let propreties:any = {}
    //     Object.keys(this).map((value: string) =>{
    //         if(!value.includes("get",0) && !value.includes("set",0) && !value.includes("add",0)){
    //             propreties[value] = {
    //                 getter:currentEnity[`get${value}`],
    //                 setter:currentEnity[`set${value}`]
    //             }
    //         }
    //     });
    //     return propreties;
    // }
}
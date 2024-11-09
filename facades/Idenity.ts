import { Database } from "../core/Database";
import { Idenity } from "../entity/Idenity";

export class IdentityFacade{
    private repository = Database.getRepository();
    private manager = Database.getManager();

    get(){
        let identity = new Idenity();
        
        identity = this.repository.getDataByIndex(0,identity);
        
        return identity
    }
    update(name:string){
        let identity = this.get();
        if(identity){
            identity.setname(name);
            this.manager.update(identity.getslug(),identity);
            return identity;
        }
        return null;
        
    }
}
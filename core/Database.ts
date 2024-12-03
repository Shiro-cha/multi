import { DataManager } from "../services/database/DataManager";
import { DataRepository } from "../services/database/DataRepository";
import { LocalService } from "../services/fileSystem/LocalService";

export class Database{
    static getManager(){
        const fileSystem = new LocalService();
        const manager = new DataManager(fileSystem);

        return manager
    }
    static getRepository(){
        const fileSystem = new LocalService();
        const repository = new DataRepository(fileSystem);
        return repository;
    }
}
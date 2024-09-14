import { Service } from "typedi";
import { LocalService } from "../fileSystem/LocalService";
import { Entity } from "../../core/Entity";

@Service()
export class DataManager {

    constructor(
        private fileSystem:LocalService
    ) {
        
    }

    create(data: Entity): void { 
        let dataList = this.getAllData();
        const tablename = data.getEntityName();

        if(!dataList[tablename]){
            dataList[tablename] = [];
        }
        
        data.setslug();
        dataList[tablename].push(data);
        this.fileSystem.write(dataList);
    }

    update(slug: string, newData: Entity) {
        const dataList = this.getAllData();
        const tablename = newData.getEntityName();
        
        if (Array.isArray(dataList[tablename]) && 0 < dataList[tablename].length) {
            const data = dataList[tablename] as Entity[]; 
            for (let i = 0; i < data.length; i++) {
                
                if(data[i].slug=== slug){
                    dataList[tablename][i] = newData;
                    break
                }
                
            }
            this.fileSystem.write(dataList);
            return newData;
        }
        return newData;
        
    }

    delete(index: number,data:Entity): boolean {
        const dataList = this.getAllData();
        const tablename = data.getEntityName();
        if (Array.isArray(dataList[tablename]) && index >= 0 && index < dataList[tablename].length) {
            dataList[tablename].splice(index, 1);
            this.fileSystem.write(dataList);
            return true;
        } else {
            return false;
        }
    }

    private getAllData(): any {
        try {
            const jsonData = this.fileSystem.read();
            return JSON.parse(jsonData);
        } catch (error) {
            this.fileSystem.write({});
            return {};
        }
        
    }
}


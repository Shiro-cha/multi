import { Entity } from "../../core/Entity";
import { LocalService } from "../fileSystem/LocalService";

export class DataRepository {

    constructor(
        private fileSystem:LocalService
    ) {}

    getAllData(table:Entity): any[] {
        const tablename = table.getEntityName();
        try {
            
            const jsonData = this.fileSystem.read();
            const databaseData = JSON.parse(jsonData);
            if(!Array.isArray(databaseData[tablename])){
                const newTable = {[tablename]:[]}
                this.fileSystem.write(newTable);
                return this.createDTO(table,databaseData[tablename]);
            }

            return this.createDTO(table,databaseData[tablename]);

        } catch (error) {
            const newTable = {[tablename]:[]}
            this.fileSystem.write(newTable);
            return this.createDTO(table,newTable[tablename]);
        }
    }

    getBySlug(slug:string,table:Entity){
        const tablename = table.getEntityName();
        const allData = this.getAllData(table);
        const data = allData.filter((value: Entity) =>value.getslug()===slug)
        if (Array.isArray(data) && data.length > 0) {
            return data[0];
        } else {
            return null;
        }
    }
    getDataByIndex(index: number,table:Entity): any {
        const tablename = table.getEntityName();
        const allData = this.getAllData(table);
        
        if (index >= 0 && index < allData.length) {
            return allData[index];
        } else {
            return null;
        }
    }
    createDTO(table:Entity,data:any[]){
    
        let dtos:Entity[] = [];
        
        data.forEach(function(value){
            const tempTable = table.create();
            const dto = tempTable.set(value)
            dtos.push(dto);
        })
        
        return dtos;
    }
}


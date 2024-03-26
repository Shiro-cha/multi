import { Service } from "typedi";
import { LocalService } from "../fileSystem/LocalService";

@Service()
export class DataManipulationService<T> {

    constructor(
        private fileSystem:LocalService
    ) {
        
    }

    create(data: T): void {
        const dataList = this.getAllData();
        dataList.push(data);
        this.fileSystem.write(dataList);
    }

    update(index: number, newData: T): void {
        const dataList = this.getAllData();
        if (index >= 0 && index < dataList.length) {
            dataList[index] = newData;
            this.fileSystem.write(dataList);
        } else {
            throw new Error("Index out of bounds");
        }
    }

    delete(index: number): void {
        const dataList = this.getAllData();
        if (index >= 0 && index < dataList.length) {
            dataList.splice(index, 1);
            this.fileSystem.write(dataList);
        } else {
            throw new Error("Index out of bounds");
        }
    }

    private getAllData(): T[] {
        const jsonData = this.fileSystem.read();
        return JSON.parse(jsonData) as T[];
    }
}


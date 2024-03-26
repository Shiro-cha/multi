import { LocalService } from "../fileSystem/LocalService";

export class DataRepositoryService<T> {
    private fileSystem: LocalService;

    constructor() {
        this.fileSystem = new LocalService("../../data.json");
    }

    getAllData(): T[] {
        const jsonData = this.fileSystem.read();
        return JSON.parse(jsonData) as T[];
    }

    getDataByIndex(index: number): T | null {
        const allData = this.getAllData();
        if (index >= 0 && index < allData.length) {
            return allData[index];
        } else {
            return null;
        }
    }
}


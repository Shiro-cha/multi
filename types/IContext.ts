import { Idenity } from "../entity/Idenity";

export interface IContext{
    search(content:any):Idenity;
}
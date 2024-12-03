import { Search } from "../../entity/Search";
import { SearchFacade } from "../../facades/Search";

export class SearchService{
    getSearchBySlug(slug:string){
        const search = new SearchFacade().getAll().filter((value: Search) =>value.getslug()===slug);
        if(Array.isArray(search) && search.length >0 ){
            return search[0];
        }
        return null;
    }
}
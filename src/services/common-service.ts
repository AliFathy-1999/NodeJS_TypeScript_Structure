import fetchDataUtils from '../utils/fetch-data-utils';
import Ipaginate from '../interfaces/paginate';
import { Document, Model } from 'mongoose'; // Adjust these imports as needed
import searchUtils from '../utils/search.utils';
import { User } from '../DB/models/users';

type ModelType<T extends Document> = Model<T>;

const getModelService = async <T extends Document>(
    Model: ModelType<T>,
    utilities: { [key: string]: any }
    ): Promise<Ipaginate> => {
        const { page, limit, sort, select } = utilities
        const model = Model.find()
        const fetchData = new fetchDataUtils(model, { page, limit, sort, select });
        (await fetchData.sort().paginate()).selection();
        const results = await fetchData.query;
        const data : Ipaginate = {
            page : +fetchData.page,
            limit : +fetchData.limit,
            totalDocs : fetchData.totalDocs,
            totalPages:fetchData.totalPages,            
            data : results as any[]
        }
        return data
};
const searchModelService = async <T extends Document>(
    Model: ModelType<T>,
    utilities: { [key: string]: any }
    ): Promise<any> => {
        const { searchField, searchValue, page, limit, sort, select } = utilities
        const searchInstance = new searchUtils(Model, {searchField, searchValue, page, limit, sort, select});
    
        const searchQueryResult = await searchInstance.search();
    
        const fetchData = new fetchDataUtils(searchQueryResult.query, { page, limit, sort, select });
        ((await fetchData.paginate()).sort()).selection();

        const results = await fetchData.query;
        
        const data: Ipaginate = {
            page: +fetchData.page,
            limit: +fetchData.limit,
            totalDocs: fetchData.totalDocs,
            totalPages: fetchData.totalPages,
            data: results as any[],
        };
    return data;
};

export default {
    getModelService,
    searchModelService
}
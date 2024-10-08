import { Document, FilterQuery, Model } from 'mongoose';
import { Page } from '../../types/Page';

export abstract class GenericService<T extends Document> {

    constructor(private readonly _model: Model<T>, private readonly _searchFields: string[]) { }

    async findAll(skip: number, limit: number, query: string): Promise<Page<T>> {
        const orConditions: FilterQuery<Document> = {
            $or: this._searchFields.map((field) => ({
                [field]: { $regex: `.*${query}.*`, $options: 'i' },
            })),
        };

        const totalRecords = await this._model.countDocuments(orConditions).exec();
        const totalPages = Math.floor((totalRecords - 1) / limit) + 1;
        const data = await this._model.find(orConditions).limit(limit).skip(skip).exec();

        return { data, totalRecords, totalPages };
    }

    async findOne(id: string): Promise<T> {
        return this._model.findOne({ _id: id }).exec();
    }

    async remove(id: string): Promise<T> {
        return this._model.findByIdAndDelete({ _id: id }).exec();
    }
}

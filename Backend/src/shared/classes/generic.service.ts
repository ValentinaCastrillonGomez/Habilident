import { Document, FilterQuery, Model } from 'mongoose';
import { Page } from '../../types/Page';

export abstract class GenericService<T extends Document, G> {

    constructor(
        private readonly _model: Model<T>,
        private readonly _searchFields: string[],
        private readonly _poputale: string[]
    ) { }

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

    async findOne(filter: Partial<FilterQuery<T>>): Promise<T> {
        return this._model.findOne(filter).populate(this._poputale).exec();
    }

    async create(dto: G): Promise<T> {
        // TODO: Validar las excepciones
        // throw new BadRequestException(ERROR_MESSAGES.REGISTERED);

        return this._model.create(dto);
    }

    async update(id: string, dto: G): Promise<T> {

        return this._model.findOneAndUpdate({ _id: id }, dto, { new: true, });
    }

    async remove(id: string): Promise<T> {
        return this._model.findByIdAndDelete({ _id: id }).exec();
    }

}

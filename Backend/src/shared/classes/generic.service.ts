import { Document, FilterQuery, Model, PopulateOptions } from 'mongoose';
import { Page } from '../../types/Page';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ERROR_MESSAGES } from '../constants/messages.const';
import { DB_ERROR_CODES } from '../constants/error-code.const';

export abstract class GenericService<T extends Document, G> {

    constructor(
        private readonly _model: Model<T>,
        private readonly _searchFields: string[],
        private readonly _poputale: PopulateOptions[]
    ) { }

    async findAll(skip = 0, limit = 0, query = ''): Promise<Page<T>> {
        const orConditions: FilterQuery<Document> = {
            $or: this._searchFields.map((field) => ({
                [field]: { $regex: `.*${query}.*`, $options: 'i' },
            })),
        };

        const totalRecords = await this._model.countDocuments(orConditions).exec();
        const data = await this._model.find(orConditions).limit(limit).skip(skip).populate(this._poputale).exec();

        return { data, totalRecords };
    }

    async findOne(filter: Partial<FilterQuery<T>>): Promise<T> {
        return this._model.findOne(filter).populate(this._poputale).exec();
    }

    async create(dto: G): Promise<T> {
        return this._model.create(dto)
            .catch(this.catchDuplicateError);
    }

    async update(id: string, dto: G): Promise<T> {
        return this._model.findOneAndUpdate({ _id: id }, dto, { new: true, })
            .catch(this.catchDuplicateError);
    }

    async remove(id: string): Promise<T> {
        return this._model.findByIdAndDelete({ _id: id }).exec();
    }

    private catchDuplicateError = (error: any) => {
        if (error.code === DB_ERROR_CODES.DUPLICATE_KEY) {
            throw new BadRequestException(ERROR_MESSAGES.REGISTERED);
        }

        throw new InternalServerErrorException(error);
    }
}

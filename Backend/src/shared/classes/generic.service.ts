import { Document, FilterQuery, Model, PopulateOptions } from 'mongoose';
import { Page } from '@habilident/types';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ERROR_MESSAGES } from '../consts/errors.const';

const ERROR_DB_DUPLICATE_KEY = 11000;

export abstract class GenericService<T extends Document, G> {

    constructor(
        private readonly _model: Model<T>,
        private readonly _searchFields: string[],
        readonly _poputale: PopulateOptions[],
        readonly _range?: string,
    ) { }

    async findAll(skip = 0, limit = 0, query = '', start = '', end = ''): Promise<Page<T>> {
        const orConditions: FilterQuery<Document> = {
            $or: this._searchFields.map((field) => ({
                [field]: { $regex: `.*${query}.*`, $options: 'i' }
            })),
        };

        if (start || end) {
            orConditions[this._range] = {};
            if (start) {
                orConditions[this._range]!['$gte'] = new Date(start);
            }
            if (end) {
                orConditions[this._range]!['$lte'] = new Date(end);
            }
        }

        const totalRecords = await this._model.countDocuments(orConditions).exec();
        const data = await this._model.find(orConditions).limit(limit).skip(skip * limit).populate(this._poputale).exec();

        return { data, totalRecords };
    }

    async find(filter: Partial<FilterQuery<T>>): Promise<T[]> {
        return this._model.find(filter).populate(this._poputale).exec();
    }

    async findOne(filter: Partial<FilterQuery<T>>): Promise<T> {
        return this._model.findOne(filter).populate(this._poputale).exec();
    }

    async create(dto: G): Promise<T | void> {
        return this._model.create(dto)
            .catch(error => this.catchDuplicateError(error));
    }

    async createAll(dto: G[]): Promise<any> {
        return this._model.insertMany(dto)
            .catch(error => this.catchDuplicateError(error));
    }

    async update(id: string, dto: Partial<T>): Promise<T | void> {
        return this._model.findOneAndUpdate({ _id: id }, dto, { new: true, })
            .catch(error => this.catchDuplicateError(error));
    }

    async remove(id: string): Promise<T> {
        return this._model.findByIdAndDelete({ _id: id }).exec();
    }

    async removeAll(): Promise<boolean> {
        await this._model.deleteMany({}).exec();
        return true;
    }

    async migrate(item: G): Promise<G> {
        return item;
    }

    private catchDuplicateError(error: any) {
        if (error.code === ERROR_DB_DUPLICATE_KEY) {
            throw new BadRequestException(ERROR_MESSAGES.REGISTERED);
        }

        throw new InternalServerErrorException(error);
    }
}

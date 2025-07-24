import { Injectable } from '@nestjs/common';
import { Content, PageOrientation } from 'pdfmake/interfaces';
import PdfPrinter from 'pdfmake';
import { RecordsService } from 'src/features/records/records.service';
import { AreaRow, FieldsConfig, INPUT_TYPES, ROW_TYPES, SingleRow, TableRow } from '@habilident/types';
import { FormatsService } from 'src/features/formats/formats.service';

const fonts = {
    Roboto: {
        normal: 'src/assets/fonts/Roboto-Regular.ttf',
        bold: 'src/assets/fonts/Roboto-Medium.ttf',
        italics: 'src/assets/fonts/Roboto-Italic.ttf',
        bolditalics: 'src/assets/fonts/Roboto-MediumItalic.ttf'
    }
};

@Injectable()
export class ReportsService {
    private readonly printer = new PdfPrinter(fonts);
    private readonly mapRows = {
        [ROW_TYPES.SINGLE]: this.getRowSingle.bind(this),
        [ROW_TYPES.AREA]: this.getRowArea.bind(this),
        [ROW_TYPES.TABLE]: this.getRowTable.bind(this),
    };

    constructor(
        private readonly recordsService: RecordsService,
        private readonly formatsService: FormatsService,
    ) { }

    async getRecordReport(recordId: string) {
        const record = await this.recordsService.findById(recordId);

        const data: Content[] = record.rows.map<Content>(row => [this.mapRows[row.type](row), '\n']);

        return this.createPdf(record.format.name, data);
    }

    async getRecordsReport(formatId: string, start: string, end: string) {
        const format = await this.formatsService.findById(formatId);
        const { data } = await this.recordsService.findAll(0, 0, formatId, start, end);

        const head = format.rows
            .filter(row => row.type === ROW_TYPES.SINGLE || row.type === ROW_TYPES.AREA)
            .flatMap(row => Array.isArray(row.fields)
                ? row.fields.map(field => ({
                    text: field.name,
                    bold: true,
                    alignment: 'center',
                    fillColor: '#cce5ff'
                }))
                : [{
                    text: row.fields.name,
                    bold: true,
                    alignment: 'center',
                    fillColor: '#cce5ff'
                }]
            );

        let body: any[];

        body = data.map(record => record.rows
            .filter(row => row.type === ROW_TYPES.SINGLE || row.type === ROW_TYPES.AREA)
            .flatMap(row => Array.isArray(row.fields) ? row.fields.map(field => field) : [row.fields]))
            .map(row => head.map(column => this.getInput(row.find(field => column.text === field.name))));

        let content: Content = {
            table: {
                headerRows: 1, widths: '*',
                body: [head, ...body],
            }
        };

        if (body.length === 0) {
            content = {
                text: 'No hay datos que coincidan con el filtro.',
                alignment: 'center',
            }
        }

        return this.createPdf(format.name, content, 'landscape');
    }

    private getRowSingle(row: SingleRow) {
        return {
            columns: row.fields.map(field => ({
                text: [
                    { text: `${field.name}: `, bold: true },
                    { text: this.getInput(field) }
                ]
            }))
        };
    }

    private getRowArea(row: AreaRow) {
        return [
            { text: `${row.fields.name}: `, bold: true },
            { text: this.getInput(row.fields) }
        ];
    }

    private getRowTable(row: TableRow) {
        return {
            table: {
                headerRows: 1, widths: '*',
                body: [
                    row.fields[0].map(field => ({
                        text: field.name,
                        bold: true,
                        alignment: 'center',
                        fillColor: '#cce5ff'
                    })),
                    ...row.fields.slice(1).map(field => field.map(input => this.getInput(input))),
                ]
            }
        };
    }

    private getInput(input: FieldsConfig) {
        switch (input?.type) {
            case INPUT_TYPES.DATE: {
                const date = new Date(input.value);
                return !isNaN(date.getTime()) ? date.toLocaleDateString() : '';
            }
            case INPUT_TYPES.LABEL:
                return input.name;
            default:
                return input?.value || '';
        }
    }

    private createPdf(title: string, content: Content, orientation: PageOrientation = 'portrait') {
        return this.printer.createPdfKitDocument({
            pageMargins: [60, 150, 60, 60],
            header: this.getHeader(title),
            content: [content],
            pageOrientation: orientation,
        });
    }

    private getHeader(title: string): Content {
        return {
            margin: [60, 20],
            columns: [
                {
                    table: {
                        widths: ['auto', '*'],
                        body: [
                            [
                                {
                                    image: 'src/assets/logo.jpg',
                                    width: 100,
                                },
                                {
                                    text: title,
                                    fontSize: 20,
                                    alignment: 'center',
                                    marginTop: 20,
                                    bold: true,
                                }
                            ]
                        ]
                    }
                }

            ]
        }
    }
}

import { Injectable } from '@nestjs/common';
import { Content, PageOrientation } from 'pdfmake/interfaces';
import PdfPrinter from 'pdfmake';
import { RecordsService } from 'src/features/records/records.service';
import { FormatField, INPUT_TYPES, ROW_TYPES, Parameter } from '@habilident/types';
import { ParametersService } from 'src/features/parameters/parameters.service';
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

    constructor(
        private readonly recordsService: RecordsService,
        private readonly formatsService: FormatsService,
        private readonly parametersService: ParametersService,
    ) { }

    async getRecordReport(id: string) {
        const record = await this.recordsService.findById(id);
        const parameters = await this.parametersService.findAll();

        const data: Content[] = record.rows.map<Content>(row => {
            if (row.type === ROW_TYPES.SINGLE) {
                return [
                    {
                        columns: row.fields[0].map(field => ({
                            text: [
                                { text: `${this.getNameField(field, parameters.data)}: `, bold: true },
                                { text: field.type === INPUT_TYPES.DATE ? new Date(field.value).toLocaleDateString() : field.value, decoration: 'underline' }
                            ]
                        }))
                    },
                    '\n',
                ];
            }
            if (row.type === ROW_TYPES.AREA) {
                return [
                    { text: `${row.fields[0][0].name}: `, bold: true, alignment: 'center' },
                    { text: row.fields[0][0].value, decoration: 'underline', alignment: 'justify' },
                    '\n',
                ];
            }
            if (row.type === ROW_TYPES.TABLE) {
                return [
                    {
                        table: {
                            headerRows: 1, widths: '*',
                            body: [
                                row.fields[0].map(field => ({
                                    text: this.getNameField(field, parameters.data),
                                    bold: true,
                                    alignment: 'center',
                                    fillColor: '#cce5ff'
                                })),
                                ...row.fields.map(field => field.map(input => input.type === INPUT_TYPES.DATE ? new Date(input.value).toLocaleDateString() : input.value)),
                            ]
                        }
                    },
                    '\n',
                ];
            }
            return '';
        });

        return this.createPdf(record.format.name, data);
    }

    async getFormatReport(id: string, start: string, end: string) {
        const format = await this.formatsService.findById(id);
        const { data } = await this.recordsService.findAll(0, 0, id, start, end);
        const parameters = await this.parametersService.findAll();

        const head = format.rows
            .filter(row => row.type === ROW_TYPES.SINGLE)
            .flatMap(row => row.fields.map(field => ({
                text: this.getNameField(field, parameters.data),
                bold: true,
                alignment: 'center',
                fillColor: '#cce5ff'
            })));

        let body: any[];

        body = data.map(record => record.rows
            .filter(row => row.type === ROW_TYPES.SINGLE)
            .flatMap(row => row.fields[0].map(field => field)))
            .map(row => head.map(column => {
                const field = row.find(field => column.text === this.getNameField(field, parameters.data));
                return field?.type === INPUT_TYPES.DATE ? new Date(field.value).toLocaleDateString() : field?.value || '[No registrado]';
            }));

        let content: Content = {
            table: {
                headerRows: 1, widths: '*',
                body: [head, ...body],
            }
        };

        if (body.length === 0) {
            content = {
                text: 'Sin registros',
                alignment: 'center',
            }
        }

        return this.createPdf(format.name, content, 'landscape');
    }

    getNameField(field: FormatField, parameters: Parameter[]) {
        if (field.type === INPUT_TYPES.SELECT) {
            return parameters.find(parameter => parameter._id.equals(field.name)).name;
        }
        return field.name;
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

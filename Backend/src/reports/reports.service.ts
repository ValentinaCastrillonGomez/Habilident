import { Injectable } from '@nestjs/common';
import { Content } from 'pdfmake/interfaces';
import PdfPrinter from 'pdfmake';
import { RecordsService } from 'src/records/records.service';
import { ROW_TYPES, TYPES_NAMES } from 'src/types/format';

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
    private printer = new PdfPrinter(fonts);

    constructor(private readonly recordsService: RecordsService) { }

    async getRecordReport(_id: string) {
        const record = await this.recordsService.findOne({ _id });

        const data: Content[] = record.rows.map<Content>(row => {
            if (row.type === ROW_TYPES.SINGLE) {
                return {
                    columns: row.fields[0].map(field => ({
                        text: [{ text: `${field.name}: `, bold: true, alignment: 'center' }, { text: field.value, decoration: 'underline', alignment: 'center' }]
                    }))
                };
            }
            return '';
        });

        return this.createPdf(record.format.name, data);
    }



    private createPdf(title: string, content: Content) {
        return this.printer.createPdfKitDocument({
            pageMargins: [60, 150, 60, 60],
            header: this.getHeader(title),
            content: [content],
        });
    }

    private getHeader(title: string): Content {
        return {
            margin: [60, 20],
            columns: [
                {
                    table: {
                        body: [
                            [
                                {
                                    image: 'src/assets/logo.jpg',
                                    width: 100
                                },
                                {
                                    text: title,
                                    fontSize: 20,
                                    alignment: 'center',
                                    marginTop: 20,
                                    bold: true
                                }
                            ]
                        ]
                    }
                }

            ]
        }
    }
}

import { Injectable } from '@nestjs/common';
import { Content } from 'pdfmake/interfaces';
import PdfPrinter from 'pdfmake';
import { RecordsService } from 'src/records/records.service';

const fonts = {
    Roboto: {
        normal: 'src/assets/fonts/Roboto-Regular.ttf',
        bold: 'src/assets/fonts/Roboto-Medium.ttf',
        italics: 'src/assets/fonts/Roboto-Italic.ttf',
        bolditalics: 'src/assets/fonts/Roboto-MediumItalic.ttf'
    }
};

const logo: Content = {
    image: 'src/assets/logo.jpg',
    width: 180
};

@Injectable()
export class ReportsService {
    private printer = new PdfPrinter(fonts);

    constructor(private readonly recordsService: RecordsService) { }

    async getRecordReport(_id: string) {
        const record = await this.recordsService.findOne({ _id });
        const content: Content = ['hola mundo'];
        return this.createPdf(content, record.format.name);
    }

    private createPdf(content: Content, title: string) {
        return this.printer.createPdfKitDocument({
            header: {
                columns: [
                    logo,
                    {
                        text: title,
                        marginTop: 20
                    }
                ]
            },
            content: [content],
        });
    }
}

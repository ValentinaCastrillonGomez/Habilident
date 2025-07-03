import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'joinNames',
    pure: true
})
export class JoinNamesPipe implements PipeTransform {
    transform(items: any[], prop: string = 'name', separator: string = ', '): string {
        if (!Array.isArray(items)) return '';
        return items
            .map(item => typeof item === 'string' ? item : item?.[prop])
            .filter(Boolean)
            .join(separator);
    }
}
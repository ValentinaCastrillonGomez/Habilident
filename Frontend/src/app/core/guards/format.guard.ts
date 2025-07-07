import { inject } from '@angular/core';
import { Router, CanMatchFn, Route, UrlSegment } from '@angular/router';
import { FormatsService } from '@shared/services/formats.service';
import { paths } from 'src/app/app.routes';

export const formatGuard: CanMatchFn = async (route: Route, segments: UrlSegment[]) => {
    const router = inject(Router);
    const formatsService = inject(FormatsService);

    const formatId = segments[1]?.path;
    if (!formatId) return router.parseUrl(paths.FORMATS);

    return formatsService.get(formatId).then((format) => {
        formatsService.formatSelected.next(format);
        return true;
    }).catch(_ => router.parseUrl(paths.FORMATS));
}
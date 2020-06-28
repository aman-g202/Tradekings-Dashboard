import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AppService {
    constructor(private httpClient: HttpClient) { }

    onLoginUser(data: { userLoginId: string, password: string }) {
        return this.httpClient
            .post<any>(
                environment.base_url + environment.endPoints.login,
                data,
                {
                    observe: 'response',
                    responseType: 'json'
                }
            ).pipe(
                tap(result => {
                    if (result.status === 200) {
                        localStorage.setItem('tradekings_token', result.body.body[0].token);
                        localStorage.setItem('isAuthorized', result.body.body[0].isAuthorized);
                    } else {
                        throw new Error('Oops, Unknown error occured!');
                    }
                }),
                map(response => {
                    return true;
                }),
                catchError(error => {
                    return throwError(error);
                })
            );
    }

    listAllExecutives() {
        return this.httpClient.get(`${environment.base_url}${environment.endPoints.executive}`);
    }

    fetchCapturedData(from, through, reportType, externalId) {
        const extId = externalId !== 'all' ? `&externalId=${externalId}` : '';
        const rType = reportType === 'all' ? '' : `&reportType=${reportType}`;
        return this.httpClient
            .get<any>(
                `${environment.base_url}${environment.endPoints.capturedData}?fromDate=${from}&throughDate=${through}${rType}${extId}`,
                {
                    observe: 'response',
                    responseType: 'json'
                }
            ).pipe(
                map(response => {
                    if (response.status === 200) {
                        return response.body.body;
                    }
                    return [];
                }),
                catchError(error => {
                    return throwError(error);
                })
            );
    }
}

























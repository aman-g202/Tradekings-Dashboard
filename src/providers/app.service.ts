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

    fetchCapturedData() {
        return this.httpClient
            .get<any>(
                `${environment.base_url}${environment.endPoints.capturedData}?fromDate=10/06/2020&throughDate=27/06/2020&reportType=stocking&externalId=E0020`,
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

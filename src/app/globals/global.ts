import {HttpClient, HttpHeaders} from '@angular/common/http';

export class Global {

    public static categoryList = [
        {
            title: 'sampleCategory',
            checkbox: ['sampleCheckbox1', 'sampleCheckbox2', 'sampleCheckbox3'],
            radio: ['sampleRadio1', 'sampleRadio2'],
            input: ['sampleInput1', 'sampleInput2'],
            textarea: ['sampleTextarea'],
            color: 'secondary',
        },
        {
            title: 'B',
            checkbox: [],
            radio: [],
            input: [],
            textarea: [],
            color: 'primary',
        },
        {
            title: 'C',
            checkbox: [],
            radio: [],
            input: [],
            textarea: [],
            color: 'primary',
        }
    ];

    public static eventList = [];

    public static id = '';
    public static password = '';

    public static prmURL = 'http://localhost:3000';

    public static delIndex = -1;

    public static InitalizeCategories(serverResponseData) {
        this.categoryList = serverResponseData;
        console.log(serverResponseData);
    }

    public static InitalizeEvents(serverResponseData) {
        this.eventList = serverResponseData;
        console.table(serverResponseData);
/*
        for (let i = 0; this.eventList.length; i++) {
            delete this.eventList[i].id;
        }*/
    }

    // HTTP
    // 비동기 HTTP Get Method
    // 서버가 보낸 JSON obj를 리턴 (await getAsync() 형태로 비동기 처리를 해야 함)
    public static async getAsync(http: HttpClient, httpParams: string) {
        // Header
        const headers = new HttpHeaders();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        const options = {headers, withCredentials: false};

        // Request Get
        return JSON.parse(JSON.stringify(await new Promise(resolve => {
            http.get<object>(
                this.prmURL + httpParams,
                options
            )
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    error => {
                        resolve(error);
                    }
                );
        })));
    }

    // 비동기 HTTP Post Method
    // [리턴값] :
    // post의 결과로 서버가 보낸 JSON obj를 리턴 (await postAsync() 형태로 비동기 처리를 해야 함)
    public static async postAsync(http: HttpClient, httpParams: string, requestData) {
        // Header
        const headers = new HttpHeaders();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        const options = {headers, withCredentials: false};

        // Request Post
        return JSON.parse(JSON.stringify(await new Promise(resolve => {
            http.post<object>(
                this.prmURL + httpParams,
                requestData,
                options
            )
                .subscribe(
                    (res) => {
                        resolve(res);
                    },
                    error => {
                        resolve(error);
                    }
                );
        })));
    }
}

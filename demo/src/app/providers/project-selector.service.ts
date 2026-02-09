import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable, Subject } from "rxjs";

@Injectable()
export class ProjectSelectorService {

    private httpClient = inject(HttpClient);
    private serverUrl = 'http://localhost:3000';
    searchResult$ = new Subject<string[]>();


    getProjects(): Observable<string[]> {
        return this.httpClient.get<string[]>(`${this.serverUrl}/api/projects`).pipe(
            map(projects => projects.reverse())
        );
    }

}
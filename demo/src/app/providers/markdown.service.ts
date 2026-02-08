import { Injectable } from '@angular/core';
import {marked } from 'marked';

@Injectable()
export class MarkdownService {

    constructor() {
        marked.setOptions({
            gfm: true,
            breaks: true
        });
    }
    
    parse(text: string) {
        return marked.parse(text);
    }
}
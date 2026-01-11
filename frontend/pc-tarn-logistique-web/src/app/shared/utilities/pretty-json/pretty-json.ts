import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { Input } from '@angular/core';

@Component({
    selector: 'app-pretty-json',
    imports: [JsonPipe],
    templateUrl: './pretty-json.html',
    styleUrl: './pretty-json.css',
})
export class PrettyJson {
    @Input() data: any;
}

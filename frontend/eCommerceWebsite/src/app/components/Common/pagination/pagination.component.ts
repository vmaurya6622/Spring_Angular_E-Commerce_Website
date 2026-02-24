import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter  } from "@angular/core";

@Component({
    selector: 'app-pagination',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
    @Input() currentPage = 1;
    @Input() totalPages = 1;
    @Output() pageChange = new EventEmitter<number>();
    changePage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.pageChange.emit(page);
        }
    }
    get pages(): number[] {
        return Array.from({ length: this.totalPages }, (_, index) => index + 1);
    }

}
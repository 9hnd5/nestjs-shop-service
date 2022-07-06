import { IsNumber, IsNumberString } from 'class-validator';
import { ExampleQueries } from './example.queries'
import { PriceListQueries } from './price-list.queries'

export default [
    ExampleQueries,
    PriceListQueries
]

export class PagingQuery {
    @IsNumberString()
    pageSize: number = 10;
    @IsNumberString()
    currentPage: number = 1;
    searchText?: string;

    // pageSize returned as string if used as query model
    get _pageSize() { return parseInt(this.pageSize.toString()) }
    get _currentPage() { return parseInt(this.currentPage.toString()) }
}

export class PriceListPagingQuery extends PagingQuery {
    @IsNumberString()
    viewMode: number = 2;

    get _viewMode() { return parseInt(this.viewMode.toString()) }
}
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
}

export class PriceListPagingQuery extends PagingQuery {
    @IsNumberString()
    viewMode: number = 2;
}
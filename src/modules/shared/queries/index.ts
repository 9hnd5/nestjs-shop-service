import { IsNumberString } from 'class-validator';
import { ExampleQueries } from './example.queries'
import { PriceListQueries } from './price-list.queries'
import { UomQueries } from './uom.queries'

export default [
    ExampleQueries,
    PriceListQueries,
    UomQueries
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

export class Paging {
    @IsNumberString()
    currentPage = 1
    @IsNumberString()
    pageSize = 10
    searchText?: string
    // @IsNumberString()
    viewMode = 1

}
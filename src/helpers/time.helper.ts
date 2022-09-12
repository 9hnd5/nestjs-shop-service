export class TimeHelpers {
    /**parse Date to string format yyyymmdd */
    static parsedate(inputdate: Date) {
        let dateString = '';
        if (inputdate == null || inputdate == undefined) {
            dateString = 'null';
            return dateString;
        }
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        const mm = inputdate.getMonth() + 1;
        const dd = inputdate.getDate();
        dateString = [
            inputdate.getFullYear(),
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            (mm > 9 ? '' : '0') + mm,
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            (dd > 9 ? '' : '0') + dd,
        ].join('');

        return dateString;
    }
}

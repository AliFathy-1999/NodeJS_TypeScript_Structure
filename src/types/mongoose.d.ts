declare module 'mongoose' {
    interface Query<ResultType, DocType, THelpers = {}, RawDocType = DocType> {
        cache(options: { [key:string] : any } ): Query<ResultType, DocType, THelpers, RawDocType>;
    }
}

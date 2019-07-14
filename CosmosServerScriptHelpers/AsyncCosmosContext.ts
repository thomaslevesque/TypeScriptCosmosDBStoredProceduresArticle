import {IFeedResult} from "./IFeedResult";
import {IAsyncCosmosContext} from "./IAsyncCosmosContext";
import {ErrorCode} from "./ErrorCode"
import {ICreateOrReplaceOptions} from "./ICreateOrReplaceOptions";

export class AsyncCosmosContext implements IAsyncCosmosContext {

    get request(): IRequest { return __.request; }
    get response(): IResponse { return __.response; }

    readDocumentById(id: string, options?: IReadOptions): Promise<any> {
        let link = `${__.getAltLink()}/docs/${id}`;
        return this.readDocument(link, options);
    }

    async readDocumentByIdIfExists(id: string, options?: IReadOptions): Promise<any> {
        try {
            return await this.readDocumentById(id, options);
        } catch (err) {
            if (err.number !== 404) {
                throw err;
            }

            return null;
        }
    }

    readDocument(link: string, options?: IReadOptions): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let isAccepted = __.readDocument(link, options, (err, doc, opts) => {
                if (err) reject(err);
                resolve(doc);
            });
            if (!isAccepted) {
                // @ts-ignore
                reject(new Error(ErrorCode.NotAccepted, "readDocuments was not accepted."));
            }
        });
    }

    queryDocuments(sqlQuery: any, options?: IFeedOptions): Promise<IFeedResult> {
        return new Promise<IFeedResult>((resolve, reject) => {
            let isAccepted = __.queryDocuments(__.getSelfLink(), sqlQuery, options, (err, res, opts) => {
                if (err) reject(err);
                resolve({ feed: res, continuation: opts.continuation });
            });
            if (!isAccepted) {
                // @ts-ignore
                reject(new Error(ErrorCode.NotAccepted, "queryDocuments was not accepted."));
            }
        });
    }

    async queryFirstDocument(sqlQuery: any, options?: IFeedOptions): Promise<any> {
        let result = await this.queryDocuments(sqlQuery, options);
        if (!result.feed || !result.feed.length)
            return undefined;
        return result.feed[0];
    }

    createDocument(doc: any, options?: ICreateOptions): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let isAccepted = __.createDocument(__.getSelfLink(), doc, options, (err, res, opts) =>
            {
                if (err) reject(err);
                resolve(res);
            });
            if (!isAccepted) {
                // @ts-ignore
                reject(new Error(ErrorCode.NotAccepted, "createDocument was not accepted."));
            }
        });
    }

    replaceDocument(doc: any, options?: IReplaceOptions): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let isAccepted = __.replaceDocument(doc._self, doc, options, (err, res, opts) => {
                if (err) reject(err);
                resolve(res);
            });
            if (!isAccepted) {
                // @ts-ignore
                reject(new Error(ErrorCode.NotAccepted, "replaceDocument was not accepted."));
            }
        });
    }

    deleteDocumentById(id: string, options?: IDeleteOptions): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let link = `${__.getAltLink()}/docs/${id}`;
            let isAccepted = __.deleteDocument(link, options, (err, res, opts) => {
                if (err) reject(err);
                resolve(res)
            });

            if (!isAccepted) {
                // @ts-ignore
                reject(new Error(ErrorCode.NotAccepted, "deleteDocument was not accepted"));
            }
        });
    }

    deleteDocument(doc: any, options?: IDeleteOptions): Promise<any> {
        return new Promise<any>((resolve, reject) => {
           let isAccepted = __.deleteDocument(doc._self, options, (err, res, opts) => {
               if (err) reject(err);
               resolve(res)
           });

           if (!isAccepted) {
               // @ts-ignore
               reject(new Error(ErrorCode.NotAccepted, "deleteDocument was not accepted"));
           }
        });
    }

    createOrReplaceDocument(doc: any, options?: ICreateOrReplaceOptions): Promise<any> {
        if (doc._self) {
            return this.replaceDocument(doc, options);
        } else {
            return this.createDocument(doc, options);
        }
    }
}

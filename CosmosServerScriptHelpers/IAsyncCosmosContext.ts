import {IFeedResult} from "./IFeedResult";
import {ICreateOrReplaceOptions} from "./ICreateOrReplaceOptions";

export interface IAsyncCosmosContext {

    readonly request: IRequest;
    readonly response: IResponse;

    // Basic query and CRUD methods
    queryDocuments(sqlQuery: any, options?: IFeedOptions): Promise<IFeedResult>;
    readDocument(link: string, options?: IReadOptions): Promise<any>;
    createDocument(doc: any, options?: ICreateOptions): Promise<any>;
    replaceDocument(doc: any, options?: IReplaceOptions): Promise<any>;
    deleteDocument(doc: any, options?: IDeleteOptions): Promise<any>;

    // Helper methods
    readDocumentById(id: string, options?: IReadOptions): Promise<any>;
    readDocumentByIdIfExists(id: string, options?: IReadOptions): Promise<any>;
    deleteDocumentById(id: string, options?: IDeleteOptions): Promise<any>
    queryFirstDocument(sqlQuery: any, options?: IFeedOptions): Promise<any>;
    createOrReplaceDocument(doc: any, options?: ICreateOrReplaceOptions): Promise<any>;
}

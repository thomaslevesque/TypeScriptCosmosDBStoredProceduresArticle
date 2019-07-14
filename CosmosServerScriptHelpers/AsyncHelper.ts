import {IAsyncCosmosContext} from "./IAsyncCosmosContext";
import {AsyncCosmosContext} from "./AsyncCosmosContext";

export class AsyncHelper {
    /**
     * Executes the specified async function and returns its result as the response body of the stored procedure.
     * @param func The async function to execute, which returns an object.
     */
    public static executeAndReturn(func: (context: IAsyncCosmosContext) => Promise<any>) {
        this.executeCore(func, true);
    }

    /**
     * Executes the specified async function, but doesn't write anything to the response body of the stored procedure.
     * @param func The async function to execute, which returns nothing.
     */
    public static execute(func: (context: IAsyncCosmosContext) => Promise<void>) {
        this.executeCore(func, false);
    }

    private static executeCore(func: (context: IAsyncCosmosContext) => Promise<any>, setBody: boolean) {
        func(new AsyncCosmosContext())
            .then(result => {
                if (setBody) {
                    __.response.setBody(result);
                }
            })
            .catch(err => {
                // @ts-ignore
                getContext().abort(err);
            });
    }
}

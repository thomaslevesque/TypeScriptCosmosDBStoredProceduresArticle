import {AsyncHelper} from "CosmosServerScriptHelpers/AsyncHelper";

function setFoo() 
{
    AsyncHelper.execute(async context => {
        let result = await context.queryDocuments("SELECT * from c");
        for (let doc of result.feed) {
            doc.foo = "bar";
            await context.replaceDocument(doc);
        }
    });
}

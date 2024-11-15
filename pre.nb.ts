
//#nbts@code
import Surreal, {
    RecordId,
} from "https://deno.land/x/surrealdb@v1.0.0-beta.5/mod.ts";

export let  db = new Surreal();


await db.connect("http://127.0.0.1:8000/rpc", {
    namespace: "drugs",
    database: "drugs",
});

//#nbts@code

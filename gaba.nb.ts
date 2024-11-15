
//#nbts@code
import Surreal, {
    RecordId,
} from "https://deno.land/x/surrealdb@v1.0.0-beta.5/mod.ts";

let db = new Surreal();


await db.connect("http://127.0.0.1:8000/rpc", {
    namespace: "drugs",
    database: "drugs",
});

//#nbts@code
let p = await db.query(/* surrealql */ `select name, description, (select name, actions.action from targets.target) as targets from drugs where "Anticonvulsants" in categories.category.category`);
p = p[0]; p
//#nbts@code
let p = await db.query(/* surrealql */ `select categories, classification, class, description, superclass, (select name, actions.action from targets.target) as targets from drugs where name="Oxprenolol"`);
p = p[0][0]; p
//#nbts@code
await db.query(/* surrealql */ `select targets from drugs where "Anticonvulsants" limit 2`)
//#nbts@code

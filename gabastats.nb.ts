
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
let p = await db.query(/* surrealql */ `select name, (select name, actions from targets.target) as target from drugs where "Anticonvulsants" in categories.category.category split target`);
p = p[0]; p
//#nbts@code
let p = await db.query(/* surrealql */ `select target, count(name), array::distinct(name) as meds from (select name, (select name, actions from targets.target) as target from drugs where "Anticonvulsants" in categories.category.category split target) group by target order by count desc`);
p = p[0]; p
//#nbts@code
let p = await db.query(/* surrealql */ `select target, count(name), array::distinct(name) as meds from (select name, (select name, actions from targets.target) as target from drugs where "Anti-Anxiety Agents" in categories.category.category split target) group by target order by count desc`);
p = p[0]; p
//#nbts@code

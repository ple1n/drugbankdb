
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
let p = await db.query(/* surrealql */ `select categories, classification, class, description, superclass, (select name, actions.action from targets.target) as targets from drugs where name="Pregabalin"`);
p = p[0][0]; p
//#nbts@code
p = await db.query(/* surrealql */ `select  name from drugs where  "Voltage-dependent calcium channel subunit alpha-2/delta-1" in targets.target.name`);
p
//#nbts@code
p = await db.query(/* surrealql */ `select  name,  categories, classification, class, description, superclass, (select name, actions.action from targets.target) as targets from drugs where  name = "Cyclandelate"`);
p
//#nbts@code

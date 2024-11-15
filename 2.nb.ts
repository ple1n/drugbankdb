
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
let p = await db.query(`select * from drugs where name = "Pregabalin"`); p[0][0];
//#nbts@code
p[0][0].transporters.transporter[0].id
//#nbts@code
let id = "BE0000222"
let tn = "Large neutral amino acids transporter small subunit 1"
let p = await db.query(` select name, transporters.transporter.name as tn, targets.target.name as tgn from drugs where transporters.transporter.id contains "${id}"`); p
//#nbts@code
let p = await db.query(` select name, transporters.transporter.name as tn, targets.target.name as tgn from drugs where "Potassium voltage-gated channel subfamily H member" in targets.target.name`); p
//#nbts@code
await db.query(`
    select *, array::len(n) from [{n:["a","ak"]}, {n:["ax","an"]}] where array::filter(2)` )
//#nbts@code

//#nbts@code

//#nbts@code
let p = await db.query(/* surrealql */ `select name from drugs where ["Tranquilizing Agents"] ANYINSIDE categories.category.category and ["Benzazepines", "Neurotoxic agents"] NONEINSIDE categories.category.category`); p
//#nbts@code
let p = await db.query(`select categories.category from drugs where name = "Zolazepam"`)
//#nbts@code
p[0][0]
//#nbts@code

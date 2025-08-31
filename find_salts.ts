
import Surreal, {
    RecordId,
} from "https://deno.land/x/surrealdb@v1.0.0-beta.5/mod.ts";


import { cas, db, gene_name, v } from "./prequel.ts";
import { DrugData } from "./drug.interfaces.ts";
import { DrugFields } from "./drug.fields.ts";

let p = await db.query(  /* surrealql */ `select name, indication, salts, ${DrugFields.averageMass} from drugs limit 20`);
let k: DrugData = p[0] as DrugData;
let f = k[0];

await Deno.writeTextFile("./salts.out.json", JSON.stringify(k, null, 2))

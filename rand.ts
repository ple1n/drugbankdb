
import Surreal, {
    RecordId,
} from "https://deno.land/x/surrealdb@v1.0.0-beta.5/mod.ts";


import { cas, db, gene_name, v } from "./prequel.ts";

// let p = await db.query(  /* surrealql */ `select * from drugs order by rand() limit 20`);
let p = await db.query(  /* surrealql */ `select * from drugs limit 20`);
let k = p[0]

await Deno.writeTextFile("./rand.json", JSON.stringify(k, null, 2))
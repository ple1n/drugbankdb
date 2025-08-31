
//#nbts@code
import Surreal, {
    RecordId,
} from "https://deno.land/x/surrealdb@v1.0.0-beta.5/mod.ts";


import { cas, db, gene_name, v } from "./prequel.ts";

//#nbts@code
let p = await db.query(  /* surrealql */ `select * from drugs order by rand() limit 20`);
let k = p[0]
k[0]
//#nbts@code

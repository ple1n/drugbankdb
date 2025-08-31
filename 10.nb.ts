
//#nbts@code
import Surreal, {
    RecordId,
} from "https://deno.land/x/surrealdb@v1.0.0-beta.5/mod.ts";


import { cas, db, gene_name, v } from "./prequel.ts";

//#nbts@code
let p = await db.query(  /* surrealql */ `select * from drugs limit 5`);
let k = p[0]
k[0]
//#nbts@code
let cc = "categories.category.category";
let mw = v("average-mass");
let ind = "indication";
let p = await db.query(/* surrealql */ `select ${mw} as mw, name, ${cc} as category, ${ind} from drugs order by mw
    desc limit 5`);
p
//#nbts@code

let p = await db.query(/* surrealql */ `select ${mw} as mw, name, description from drugs where ${mw} > 0 order by mw
    asc limit 100`);
p
//#nbts@code
let mw = v("average-mass");
let p = await db.query(/* surrealql */ `select ${mw} as mw, name from drugs where ${mw} > 0 order by mw
    asc limit 100`);
p
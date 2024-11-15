
//#nbts@code
import { db } from "./pre.nb.ts";
//#nbts@code
let p = await db.query(/* surrealql */ `select categories, classification, class, description, superclass, (select name, actions.action from targets.target) as targets from drugs where name="Fasoracetam"`);
p = p[0][0]; p
//#nbts@code
let p = await db.query(/* surrealql */ `select * from drugs where name="Fasoracetam"`);
p = p[0][0]; p
//#nbts@code

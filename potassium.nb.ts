
//#nbts@code
import { db } from "./pre.nb.ts";

//#nbts@code
await db.query(/*surrealql*/`
    select targets.target as t from drugs where name = "Gabapentin"`)
//#nbts@code
let q = await db.query(/*surrealql*/`
    select name, targets.target.name as t from drugs where !!targets.target.name && (if type::is::array(targets.target.name) then  targets.target.name.any(|$v|"Potassium" in $v) else "Potassium" in targets.target.name end)`);
q
//#nbts@code

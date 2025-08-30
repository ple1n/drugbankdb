
//#nbts@code
import { db } from "./pre.nb.ts";

//#nbts@code
await db.query(/*surrealql*/`
    select targets.target as t from drugs where name = "Gabapentin"`)
//#nbts@code
await db.query("select * from drugs where name = $name", {name: "Alprazolam"})
//#nbts@code
let q = await db.query(/*surrealql*/`
    select name, targets.target.name as t from drugs where !!targets.target.name && (if type::is::array(targets.target.name) then  targets.target.name.any(|$v|"Potassium" in $v) else "Potassium" in targets.target.name end)`);
q
//#nbts@code
let q = await db.query(/*surrealql*/`
    select name, targets.target.name as t, description as d, targets.target.name.len() as tl from drugs 
    where (if type::is::array(targets.target.name) then targets.target.name.any(|$v|"calcium channel" in $v) else "calcium channel" in targets.target.name end)
    order by tl asc`, {
});
q
//#nbts@code
let q = await db.query(/*surrealql*/`
    select name, targets.target.name as t, description as d, targets.target.name.len() as tl from drugs 
    where (if type::is::array(targets.target.name) then targets.target.name.any(|$v|"calcium channel" in $v) else "calcium channel" in targets.target.name end)
    and "toxic" not in description
    order by tl asc`, {
});
q
//#nbts@code

//#nbts@code

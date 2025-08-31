import Surreal, {
  RecordId,
} from "https://deno.land/x/surrealdb@v1.0.0-beta.5/mod.ts";
export { DrugFields } from "./drug.fields.ts";

export const db = new Surreal();

await db.connect("http://127.0.0.1:8000/rpc", {
  namespace: "drugs",
  database: "drugs",
});

export const cas = "`cas-number`";
export const vod = "`volume-of-distribution`";
export const gene_name = "`gene-name`";

export function v(name: string) {
  return "`" + name + "`";
}

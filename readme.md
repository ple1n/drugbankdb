changes

- updated surrealdb to v2

### Rust tool for importing Drug Bank XML data to SurrealDB


```sh
➜  drugbankdb git:(master) grep '<drug ' /portable/DrugBank.xml | wc -l # rough estimate of number of drugs
16581 
```

remove one line in the database xml before importing 
```
<drugbank xmlns="http://www.drugbank.ca" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.drugbank.ca http://www.drugbank.ca/docs/drugbank.xsd" version="5.1" exported-on="2024-03-14">


```
as well as the matching `</drugbank>` in the end.

## Deno notebook-ing with Jupyter

[vscode-extension](https://github.com/redking00/vscode-nbts/releases)

## SurrealQL syntax highlighting within typescript in place

```
Name: SurrealQL
Id: surrealdb.surrealql
Description: Official support for the surrealql query language, used by SurrealDB!
Version: 0.2.16
Publisher: SurrealDB
VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=surrealdb.surrealql
```

TODO:

- [ ] Insert drug interaction as `record` graph edges.
- [ ] Convert types, `created` as date, `average-mass` as float
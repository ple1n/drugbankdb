export interface DrugProperty {
  kind?: string;
  source?: string;
  value?: string | number;
}

export interface DrugInteraction {
  description?: string;
  "drugbank-id"?: string;
  name?: string;
}

export interface DrugCategory {
  category?: string;
  'mesh-id'?: string;
}

export interface DrugDosage {
  form?: string;
  route?: string;
  strength?: string;
}

export interface DrugIdentifier {
  resource?: string;
}

export interface DrugSynonym {
  _body?: string;
  language?: string;
}

export interface DrugPDBEntry {
  'pdb-entry'?: string | string[];
}

export interface Drug {
  'average-mass'?: number;
  'calculated-properties'?: {
    property?: DrugProperty[];
  };
  'cas-number'?: string;
  categories?: {
    category?: DrugCategory[];
  };
  classification?: {
    'alternative-parent'?: string[];
    class?: string;
    description?: string;
    'direct-parent'?: string;
    kingdom?: string;
    subclass?: string;
    substituent?: string[];
    superclass?: string;
  };
  created?: string;
  description?: string;
  dosages?: {
    dosage?: DrugDosage[];
  };
  'drug-interactions'?: {
    'drug-interaction'?: DrugInteraction | DrugInteraction[];
  };
  'drugbank-id'?: {
    _body?: string;
    primary?: boolean;
  } | string[];
  'experimental-properties'?: {
    property?: DrugProperty;
  };
  'external-identifiers'?: {
    'external-identifier'?: DrugIdentifier[];
  };
  groups?: {
    group?: string | string[];
  };
  id?: {
    tb?: string;
    id?: string;
  };
  indication?: string;
  'mechanism-of-action'?: string;
  mixtures?: {
    mixture?: Array<{name?: string}>;
  };
  'monoisotopic-mass'?: number;
  name?: string;
  'pdb-entries'?: DrugPDBEntry;
  'pharmacodynamics'?: string;
  products?: {
    product?: Array<{
      'started-marketing-on'?: string;
      strength?: string;
    }>;
  };
  'route-of-elimination'?: string;
  state?: string;
  synonyms?: {
    synonym?: DrugSynonym | DrugSynonym[];
  };
  type?: string;
  unii?: string;
  updated?: string;
}

export interface DrugData extends Array<Drug> {}

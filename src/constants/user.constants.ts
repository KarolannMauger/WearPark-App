export const DISEASES = [
    "Parkinson",
    "Alzheimer",
    "Sclérose en plaques",
    "Épilepsie",
    "Autre",
] as const;

export type Disease = typeof DISEASES[number];


export const GENDERS = [
    "Homme",
    "Femme",
    "Autre",
    "Préfère ne pas dire",
] as const;

export type Gender = typeof GENDERS[number];


export const ROLES = ['USER', 'ADMIN'] as const;

export type Role = typeof ROLES[number];
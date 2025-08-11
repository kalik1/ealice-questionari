export interface LastSF12Results {
    lastMCS: number | null;
    lastPCS: number | null;
    lastMCSinPct: number | null;
    lastPCSinPct: number | null;
}

export interface LastParametriResults {
    lastFrequenza?: number | null;
    lastPeso?: number | null;
    lastsaturazione?: number | null;
    lastGlicemia?: number | null;
}

export interface LastSharefi75Results {
    lastDFactor: number | null;
    lastDFactorinPct: number | null;
}

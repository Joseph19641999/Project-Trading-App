export interface AssetTable {
    id: number;
    aktienFondsSymbol: string;
    aktienFondsName: string;
    menge: number;
    einzelwert: number;
    gesamtwert: number;
    eintiegkurs: number;
    rendite: number;
    rendite_in_procent: number;
    isFund: boolean;
    userId: number;
}
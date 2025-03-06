import { AssetTable } from "./asset-table";

export class AssetTableDTO implements AssetTable {
    public id!: number;
    public aktienFondsSymbol!: string;
    public aktienFondsName!: string;
    public menge!: number;
    public einzelwert!: number;
    public gesamtwert!: number;
    public eintiegkurs!: number;
    public rendite!: number;
    public rendite_in_procent!: number;
    public isFund!: boolean;
    public userId!: number;

    constructor(data: Partial<AssetTable> = {}) {
        Object.assign(this, data);
    }
}

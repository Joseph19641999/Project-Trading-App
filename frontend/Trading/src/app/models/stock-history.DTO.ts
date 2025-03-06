import { IStockHistory } from "./stock-history";

export class StockHistoryDTO implements IStockHistory {
    public date!: string;
    public open!: number;
    public high!: number;
    public low!: number;
    public close!: number;
    public adjClose!: number;
    public volume!: number;
    public unadjustedVolume!: number;
    public change!: number;
    public changePercent!: number;
    public vwap!: number;
    public label!: string;
    public changeOverTime!: number;

    constructor(data: Partial<IStockHistory> = {}) {
        Object.assign(this, data);
    }
}

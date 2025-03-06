import { IStockData } from "./stock-data";

export class StockDataDTO implements IStockData {
    public symbol!: string;
    public price!: number;
    public beta!: number;
    public volAvg!: number;
    public mktCap!: number;
    public lastDiv!: number;
    public range!: string;
    public changes!: number;
    public companyName!: string;
    public currency!: string;
    public cik!: string;
    public isin!: string;
    public cusip!: string;
    public exchange!: string;
    public exchangeShortName!: string;
    public industry!: string;
    public website!: string;
    public description!: string;
    public ceo!: string;
    public sector!: string;
    public country!: string;
    public fullTimeEmployees!: string;
    public phone!: string;
    public address!: string;
    public city!: string;
    public state!: string;
    public zip!: string;
    public dcfDiff!: number;
    public dcf!: number;
    public image!: string;
    public ipoDate!: string;
    public defaultImage!: boolean;
    public isEtf!: boolean;
    public isActivelyTrading!: boolean;
    public isAdr!: boolean;
    public isFund!: boolean;

    constructor(data: Partial<IStockData> = {}) {
        Object.assign(this, data);
    }

}
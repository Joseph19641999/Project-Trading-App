import { assetCatalog } from "./asset-catalog";

export class assetCatalogDTO implements assetCatalog {
    public symbol!: string;
    public companyName!: string;
    public price!: number;
    public changes!: number;
    public mktCap!: number;
    public exchange!: string;
    public rank!: number;
    public isFavorite!: boolean;

    constructor(data: Partial<assetCatalog> = {}) {
        Object.assign(this, data);
    }
}

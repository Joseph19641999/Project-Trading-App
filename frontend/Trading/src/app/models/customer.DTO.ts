import { ICustomer } from "./customer";

export class CustomerDTO implements ICustomer {
    public id!: number ;
    public vorname!: string;
    public nachname!: string;
    public geburtsdatum!: Date ;
    public email!: string ;
    public budget!: number;

    public password!: string;

    constructor(data: Partial<ICustomer> = {}) {
        Object.assign(this, data);
    }

}

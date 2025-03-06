const EntitySchema = require("typeorm").EntitySchema;

module.exports = {
    name: "Asset",
    tableName: "assets",
    columns: {
        symbol: {
            type: "varchar",
            unique: true,
            nullable: false,
            primary: true
        },
        price: {
            type: "decimal",
            precision: 15,
            scale: 2,
            nullable: false
        },
        beta: {
            type: "decimal",
            precision: 15,
            scale: 2,
            nullable: true
        },
        volAvg: {
            type: "decimal",
            precision: 15,
            scale: 2,
            nullable: true
        },
        mktCap: {
            type: "decimal",
            precision: 20,
            scale: 2,
            nullable: true
        },
        lastDiv: {
            type: "decimal",
            precision: 15,
            scale: 2,
            nullable: true
        },
        range: {
            type: "varchar",
            nullable: true
        },
        exchangeShortName: {
            type: "varchar",
            nullable: true
        },
        changes: {
            type: "decimal",
            precision: 15,
            scale: 2,
            nullable: true
        },
        companyName: {
            type: "varchar",
            nullable: false
        },
        currency: {
            type: "varchar",
            nullable: true
        },
        isin: {
            type: "varchar",
            nullable: true
        },
        exchange: {
            type: "varchar",
            nullable: true
        },
        website: {
            type: "varchar",
            nullable: true
        },
        description: {
            type: "text",
            nullable: true
        },
        ceo: {
            type: "varchar",
            nullable: true
        },
        sector: {
            type: "varchar",
            nullable: true
        },
        country: {
            type: "varchar",
            nullable: true
        },
        fullTimeEmployees: {
            type: "varchar",
            nullable: true
        },
        city: {
            type: "varchar",
            nullable: true
        },
        image: {
            type: "varchar",
            nullable: true
        },
        isFund: {
            type: "boolean",
            nullable: true
        }
    }
};

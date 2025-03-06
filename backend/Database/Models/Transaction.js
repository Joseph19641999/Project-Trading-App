const EntitySchema = require("typeorm").EntitySchema;

module.exports = {
    name: "Transaction",
    tableName: "transactions",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        isKauf: {
            type: "boolean"
        },
        aktienFondsSymbol: {
            type: "varchar"
        },
        aktienFondsName: {
            type: "varchar"
        },
        menge: {
            type: "int"
        },isFund: {
            type: "boolean"
        },
        transaktionsdatum: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP"
        },
        einzelwert: {
            type: "decimal",
            precision: 10,
            scale: 2
        },
        gesamtwert: {
            type: "decimal",
            precision: 10,
            scale: 2
        },
        userId: {
            type: "int"
        }
    },
    relations: {
        user: {
            target: "User",
            type: "many-to-one",
            joinColumn: { name: "userId" },
            cascade: ["insert", "update"]
        }
    }
}


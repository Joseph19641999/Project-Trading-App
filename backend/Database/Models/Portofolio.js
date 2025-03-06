const EntitySchema = require("typeorm").EntitySchema;

module.exports = {
    name: "Portfolio",
    tableName: "portfolios",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        aktienFondsName: {
            type: "varchar"
        }, 
        aktienFondsSymbol: {
            type: "varchar"
        },
        menge: {
            type: "int"
        },
        einzelwert: {
            type: "decimal",

        },
        gesamtwert: {
            type: "decimal",

        },
        eintiegkurs: {
            type: "decimal",

        },
        rendite: {
            type: "decimal",

        },
        rendite_in_procent: {
            type: "decimal",

        },
        isFund: {
            type: "bool"
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

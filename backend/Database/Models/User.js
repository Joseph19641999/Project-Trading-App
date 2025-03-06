const EntitySchema = require("typeorm").EntitySchema;
const Transaction = require("./Transaction");
const Portfolio = require("./Portofolio");

module.exports = {
    name: "User",
    tableName: "users", 
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        nachname: {
            type: "varchar"
        },
        vorname: {
            type: "varchar"
        },
        email: {
            type: "varchar",
            unique: true
        },

    geburtsdatum: {
        type: "date",
        nullable: true
    },
        password: {
            type: "varchar"
        },
        budget: {
            type: "decimal",

        }
    },
    relations: {
        transactions: {
            target: "Transaction",
            type: "one-to-many",
            inverseSide: "user",
            cascade: ["insert", "update", "remove"]
        },
        portfolios: {
            target: "Portfolio",
            type: "one-to-many",
            inverseSide: "user",
            cascade: ["insert", "update", "remove"] 
        }
    }
}

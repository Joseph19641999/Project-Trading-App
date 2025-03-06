const EntitySchema = require("typeorm").EntitySchema;

module.exports = {
    name: "Favorite",
    tableName: "favorites",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        userId: {
            type: "int"
        },
        assetSymbols: {
            type: "varchar",
            array: true,
            nullable: true
        }
    },
    relations: {
        user: {
            target: "User",
            type: "many-to-one",
            joinColumn: { name: "userId" },
            cascade: false
        }
    }
}

import {MigrationInterface, QueryRunner, Table } from "typeorm";

export class createProductsTags1617222493230 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {  
        await queryRunner.createTable(new Table(
            {
                name: "products_tags",
                columns: [
                    {
                        name: "product_id",
                        type: "integer",
                        isPrimary: true,
                    },
                    {
                        name: "tag_id",
                        type: "integer",
                        isPrimary: true,
                    },
                ],
                foreignKeys: [
                    {
                        name: "ProductTag",
                        referencedTableName: "products",
                        referencedColumnNames: ["id"],
                        columnNames: ["product_id"],
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE"
                    },
                    {
                        name: "TagProduct",
                        referencedTableName: "tags",
                        referencedColumnNames: ["id"],
                        columnNames: ["tag_id"],
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE"
                    }
                ]
            }
        ))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('products_tags') 
    }

}

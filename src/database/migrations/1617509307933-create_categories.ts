import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createCategories1617509307933 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
          name: 'categories',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
            },
            {
              name: 'category',
              type: 'varchar',
            },
          ],
        }))
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('categories');
      }
    }
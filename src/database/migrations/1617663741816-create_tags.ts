import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createTags1617663741816 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
          name: 'categories',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
            },
            {
              name: 'tag',
              type: 'varchar',
            },
          ],
        }))
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('categories');
      }
    }
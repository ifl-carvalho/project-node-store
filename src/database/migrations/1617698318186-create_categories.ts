import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createCategories1617698318186 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'categories',
            columns: [
              {
                name: 'id',
                type: 'integer',
                unsigned: true,
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',
              },
              {
                name: 'name',
                type: 'varchar',
              },
            ],
          }))
        }
      
        public async down(queryRunner: QueryRunner): Promise<void> {
          await queryRunner.dropTable('categories');
        }
      }
      
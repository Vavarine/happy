import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";
import { boolean } from "yup";

export class updateOrphanages1605629881147 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('orphanages', new TableColumn({
            name: 'validated',
            type: 'boolen',
            default: false
        }));

        await queryRunner.addColumn('orphanages', new TableColumn({
            name: 'user_id',
            type: 'int',
            isNullable: false
        }));

        await queryRunner.createForeignKey("orphanages", new TableForeignKey({
            columnNames: ["user_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('orphanages', 'validated');
        await queryRunner.dropColumn('orphanages', 'user_id');
    }

}

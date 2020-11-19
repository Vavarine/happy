import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class updateUsers1605738940853 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('users', new TableColumn({
            name: 'admin',
            type: 'boolen',
            default: false
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', 'admin');
    }

}

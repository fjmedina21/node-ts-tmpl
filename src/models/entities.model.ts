import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	BaseEntity
} from "typeorm";

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	uId: string;

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column({unique:true, nullable: false})
	email: string;

	@Column({nullable:false})
	password: string;

	@Column({ default: true })
	state: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}

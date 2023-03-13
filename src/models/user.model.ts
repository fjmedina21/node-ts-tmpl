import {
	BaseEntity,
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
} from "typeorm";

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	uId: string;

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column({ unique: true, nullable: false })
	email: string;

	@Column({ nullable: false, select: false })
	password: string;

	@Column({ default: true, select: false })
	state: boolean;

	@Column({ default: false })
	isAdmin: boolean;

	@CreateDateColumn({update:false})
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}

export interface IUser {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	isAdmin: boolean;
	state: boolean;
}
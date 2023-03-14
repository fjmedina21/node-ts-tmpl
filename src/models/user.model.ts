import bcrypt from "bcryptjs";

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

	@Column({ unique: true })
	email: string;

	@Column({ select: false })
	password: string;

	@Column({ default: true, select: false })
	state: boolean;

	@Column({ default: false, select: false })
	isAdmin: boolean;

	@Column({ default: true, select: false })
	isUser: boolean;

	@CreateDateColumn({ update: false })
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@Column({ nullable: true, select: false })
	resetToken: string;

	hashPassword(password: string): void {
		const salt = bcrypt.genSaltSync(15);
		this.password = bcrypt.hashSync(password, salt);
	}

	comparePassword(password: string): boolean {
		return bcrypt.compareSync(password, this.password);
	}
}

export interface IUser {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	isAdmin: boolean;
	isUser: boolean;
	state: boolean;
}

import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CURRENT_TIMESTAMP } from "../../utils/constants";
import { Product } from "../../products/entities/product.entity";
import { Review } from "../../reviews/entities/review.entity";
import { UserType } from "../../utils/enums";
import { Exclude } from "class-transformer";


@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 250, unique: true })
    email!: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    username!: string;

    @Column()
    @Exclude()
    password!: string;

    @Column({ type: "enum", enum: UserType, default: UserType.NORMAL_USER })
    userType!: UserType;

    @Column({ default: false })
    isAccountVerified!: boolean;


    @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP })
    updated_at!: Date;


    @OneToMany(() => Review, (review) => review.user)
    reviews!: Review[];

    @OneToMany(() => Product, (product) => product.user)
    products!: Product[];
}

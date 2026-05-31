import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CURRENT_TIMESTAMP } from "../../utils/constants";
import { Review } from "../../reviews/entities/review.entity";
import { User } from "../../users/entities/user.entity";


@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    description!: string;

    @Column()
    price!: number;

    @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP })
    updated_at!: Date;

    @OneToMany(() => Review, (review) => review.product, { eager: true })
    reviews?: Review[];

    @ManyToOne(() => User, (user) => user.products, { eager: true })
    user!: User;

}

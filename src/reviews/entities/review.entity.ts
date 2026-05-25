import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CURRENT_TIMESTAMP } from "../../utils/constants";
import { Product } from "../../products/entities/product.entity";
import { User } from "../../users/entities/user.entity";


@Entity({ name: 'reviews' })
export class Review {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    rating!: number;

    @Column()
    comment!: string;

    @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP })
    updated_at!: Date;


    @ManyToOne(() => Product, (product) => product.reviews)
    product!: Product;

    @ManyToOne(() => User, (user) => user.reviews)
    user!: User;
}

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
    BeforeUpdate
} from "typeorm";

@Entity()
export abstract class Product {

    @PrimaryGeneratedColumn("uuid")
    product_id: string;

    @Column({
        type: "text",
        unique: true
    })
    title: string;

    @Column({
        type: "float",
        default: 0
    })
    price: number;

    @Column({
        type: "text",
        nullable: true,
    })
    description: string;

    @Column({
        type: "text",
        unique: true
    })
    slug: string;

    @Column({
        type: "int",
        default: 0
    })
    stock: number;

    @Column({
        type: "text",
        array: true
    })
    sizes: string[];

    @Column("text")
    gender: string;

    @BeforeInsert()
    @BeforeUpdate()
    formatSlug(): void {
        if (!this.slug) {
            this.slug = this.title;
        }
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(" ", "_")
            .replaceAll("'", "");
    }

    
}

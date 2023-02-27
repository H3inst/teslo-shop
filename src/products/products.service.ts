import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { validate as isUUID } from "uuid";
//
import { CreateProductDto } from "./dto/create_product.dto";
import { UpdateProductDto } from "./dto/update_product.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
//
import { Product } from "./entities/product.entity";

@Injectable()
export class ProductsService {
    /**
     * Constructor... dependency injection.
     * @param {Repository<Product>} product_repository 
     */
    constructor(
        @InjectRepository(Product)
        private readonly product_repository: Repository<Product>
    ) { }

    /**
     * Create a product.
     * @param {CreateProductDto} create_product_dto Product body
     */
    public async create(create_product_dto: CreateProductDto): Promise<Product> {
        try {
            const product = this.product_repository.create(create_product_dto);
            await this.product_repository.save(product);

            return product;

        } catch (error) {
            throw new BadRequestException("Product could not be created. Please, check the properties.");
        }
    }

    /**
     * Get all products.
     * @returns Return all products.
     */
    public async findAll(pagination_dto: PaginationDto): Promise<Product[]> {
        const { limit = 0, offset = 0 } = pagination_dto;
        const products = await this.product_repository.find({
            take: limit,
            skip: offset
        });

        return products;
    }

    /**
     * Get a product by id.
     * @param {string} product_term Product ID.
     * @returns Return a product by id.
     */
    public async findOne(product_term: string): Promise<Product> {
        let product: Product;

        if (isUUID(product_term)) {
            product = await this.product_repository.findOneBy({ product_id: product_term });
        } else {
            product = await this.product_repository.findOneBy({ slug: product_term });
        }
        // const product = await this.product_repository.findOneBy({ product_term });

        if (!product)
            throw new NotFoundException(`Product with term '${product_term}' not found.`);

        return product;
    }

    public async update(product_id: string, update_product_dto: UpdateProductDto): Promise<Product> {
        const product = await this.product_repository.preload({
            product_id,
            ...update_product_dto
        });

        if (!product)
            throw new NotFoundException(`Product with id '${product_id}' not found.`);

        return await this.product_repository.save(product);
    }

    /**
     *  Remove a product by id.
     * @param {string} product_id UUID
     */
    public async remove(product_id: string): Promise<void> {
        const product = await this.findOne(product_id);

        await this.product_repository.remove(product);
    }
}

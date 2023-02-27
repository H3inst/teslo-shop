import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ParseUUIDPipe
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create_product.dto";
import { UpdateProductDto } from "./dto/update_product.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { Product } from "./entities/product.entity";

@Controller("products")
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    create(@Body() createProductDto: CreateProductDto): Promise<Product> {
        return this.productsService.create(createProductDto);
    }

    @Get()
    findAll(@Query() pagination_dto: PaginationDto): Promise<Product[]> {
        return this.productsService.findAll(pagination_dto);
    }

    @Get(":product_id",)
    findOne(@Param("product_term") product_term: string): Promise<Product> {
        return this.productsService.findOne(product_term);
    }

    @Patch(":product_id")
    update(
        @Param("product_id", ParseUUIDPipe) product_id: string,
        @Body() updateProductDto: UpdateProductDto
    ): Promise<Product> {
        return this.productsService.update(product_id, updateProductDto);
    }

    @Delete(":product_id")
    remove(@Param("product_id") product_id: string): Promise<void> {
        return this.productsService.remove(product_id);
    }
}

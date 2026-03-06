import type { Product } from "./product";

export interface ICategory {
    id: number,
    name: string,
    image: string,
    description?: string,
    products: Product[]
}

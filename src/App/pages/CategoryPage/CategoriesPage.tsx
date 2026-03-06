import type { ICategory } from "types/category";
import Category from "./components/Category";
import s from './CategoriesPage.module.scss';

type CategoryPageProps = {
    categories: ICategory[];
}

const defCategories: ICategory[] = [
    {
        id: 1,
        name: "Chair",
        image: "public/categories/chair.png",
        description: "Elegant and comfortable chairs for your living space",
        products: []
    },
    {
        id: 2,
        name: "Cupboard",
        image: "public/categories/cupboard.png",
        description: "Spacious and stylish storage solutions",
        products: []
    },
    {
        id: 3,
        name: "Table",
        image: "public/categories/table.png",
        description: "Modern tables for dining and work",
        products: []
    },
    {
        id: 4,
        name: "Decoration",
        image: "public/categories/decoration.png",
        description: "Beautiful decorative items for your home",
        products: []
    }
];

const CategoriesPage = ({categories=defCategories}: CategoryPageProps) => {
    return (
        <section className={s.container}>
            {
                categories.map(category => <Category 
                    imgSrc={category.image} 
                    description={category.description}
                    name={category.name}
                />)
            }
        </section>
    );
}

export default CategoriesPage;
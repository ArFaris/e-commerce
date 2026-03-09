import type { CategoryType } from "types/category";
import Category from "./components";
import s from './CategoriesPage.module.scss';
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import categoryStore from 'store/CategoryStore';
import cn from 'classnames';

const CategoriesPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        categoryStore.loadCategories();
    }, []);

    const handleCategoryClick = (category: CategoryType) => {
        categoryStore.setCategory(category.slug);
        navigate(`/categories/${category.slug}`);
    }
    
    return (
        <section className={cn(s.container, s.page)}>
            {
                categoryStore.currentCategories().map(category => <Category 
                    key={category.id}
                    imgSrc={category.image} 
                    description={category.description}
                    name={category.name}
                    onClick={() => handleCategoryClick(category)}
                />)
            }
        </section>
    );
}

export default observer(CategoriesPage);

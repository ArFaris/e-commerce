import s from './CategoryPage.module.scss';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router';
import categoryStore from 'store/CategoryStore';
import Text from 'components/Text';
import ProductsContainer from 'components/ProductsContainer';
import ProductFilter from 'components/ProductFilter';
import { useEffect } from 'react';

const CategoryPage = () => {
    console.log('Render')
    const { name } = useParams<{name: string}>();
    console.log(name)

    useEffect(() => {
        console.log(categoryStore.category)
        if (!categoryStore.category) categoryStore.setCategory(name);
    }, [])

    const category = categoryStore.category;
    console.log(category);
    return (
        category && <section className={s.page}>
            <div className={s.page__title}>
                <Text view="title">{category?.name}</Text>
                <Text view="p-20" color="secondary">pageSubtitle={category?.text}</Text>
            </div>

            <ProductFilter />
            <ProductsContainer category={name}/>
        </section>
    );
}

export default observer(CategoryPage);

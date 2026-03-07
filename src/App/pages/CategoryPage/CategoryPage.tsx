import s from './CategoryPage.module.scss';
import Text from 'components/Text';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router';
import categoryStore from 'store/CategoryStore.ts';

const CategoryPage = () => {
    const { name } = useParams<{name: string}>();

    const category = categoryStore.currentCategory()

    return (
        category && <section className={s.page}>

            <div className={s.text}>
                <Text view="title" className={s.title}>{category?.name}</Text>
                <Text view="p-20" color="secondary">{category?.text}</Text>
            </div>

            {/* <ProductList /> */}
        </section>
    );
}

export default observer(CategoryPage);

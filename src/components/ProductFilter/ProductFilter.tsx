import Button from 'components/Button';
import Input from 'components/Input';
import styles from './ProductFilter.module.scss';
import { useState, useEffect } from 'react';
import ProductsStore from 'store/ProductsStore';
import { observer } from "mobx-react-lite";
import Filter from './components/Filter';
import filterStore from 'store/FilterStore';

const ProductFilter = () => {
    const [searchText, setSearchText] = useState('');

    const handleInputChange = (currentValue: string) => {
        setSearchText(currentValue);
    }

    const handlerButtonClick = () => {
        if (searchText.trim() === '') return;

        const str = searchText.toLocaleLowerCase();
        ProductsStore.filterByName(str);

        filterStore.setIsOpen(true);
    }

    useEffect(() => {
        if (searchText.trim() === '') {
            ProductsStore.resetFilter();
        }
    }, [searchText])

    return (
        <>
            <div className={styles.active}>
                <div className={styles.input}>
                    <Input value={searchText} placeholder="Search Product" onChange={handleInputChange} afterSlot={<></>}/>
                    <Button onClick={handlerButtonClick}>Find now</Button>
                </div>

                <Input className={styles.filter} onClick={() => filterStore.setIsOpen(true)} value={''} placeholder="Filter Product" afterSlot={<></>}/>
                {filterStore.isOpen && <Filter/>}
            </div>
        </>
    );
}

export default observer(ProductFilter);

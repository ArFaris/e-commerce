import Button from 'components/Button';
import Input from 'components/Input';
import styles from './ProductFilter.module.scss';
import { useState, useEffect } from 'react';
import MultiDropdown from 'components/MultiDropdown';
import { type Option } from 'components/MultiDropdown';
import ProductsStore from 'store/ProductsStore';
import { observer } from "mobx-react-lite";

const ProductContainer = () => {
    const [searchText, setSearchText] = useState('');

    const handleInputChange = (currentValue: string) => {
        setSearchText(currentValue);
    }

    const handleMultiDropdownChange = (selectedOptions: Option[]) => {
        ProductsStore.setCurrentOptions(selectedOptions);

        if (selectedOptions.length === 0) {
           ProductsStore.resetFilter();
        } else {
           ProductsStore.filterByOptions();
        }
    }

    const getTitle = (options: Option[]): string => {
        if (options.length === 0) return "Filter";

        const title: string = options.map(option => option.value).join(', ');
        return title;
    }

    const handlerButtonClick = () => {
        if (searchText.trim() === '') return;

        const str = searchText.toLocaleLowerCase();
        ProductsStore.filterByName(str);
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

                <MultiDropdown options={ProductsStore.options} onChange={(e) => handleMultiDropdownChange(e)} getTitle={(options: Option[]) => getTitle(options)} value={ProductsStore.selectedOptions}/>
            </div>
        </>
    );
}

export default observer(ProductContainer);

// components/Filter/index.tsx
import MultiDropdown from "components/MultiDropdown";
import ProductsStore from "store/ProductsStore";
import { type Option } from 'components/MultiDropdown';
import Text from 'components/Text';
import Input from "components/Input";
import s from './Filter.module.scss';
import ButtonsGroup from "components/ButtonsGroup";
import CheckBox from "components/CheckBox";
import CloseIcon from "components/icons/CloseIcon";
import cn from 'classnames';
import { observer } from "mobx-react-lite";
import categoryStore from "store/CategoryStore";
import { useEffect, useState } from "react";
import productFilterStore from 'store/ProductFilterStore';

const Filter: React.FC = () => {
    const [priceFromValue, setPriceFromValue] = useState<string>('');
    const [priceToValue, setPriceToValue] = useState<string>('');

    const handleMultiDropdownChange = (selectedOptions: Option[]) => {
        productFilterStore.setSelectedItems(selectedOptions);
    }

    const getTitle = (options: Option[]): string => {
        if (options.length === 0) return "Filter items";

        const title: string = options.map(option => option.value).join(', ');
        return title.length > 30 ? title.slice(0, 30) + '...' : title;
    }

    useEffect(() => {
        const loadCategories = async () => {
            await categoryStore.loadCategories();
            productFilterStore.initializeCategories();
        }

        loadCategories();
    }, []);

    const handleCheckBoxChange = (id: string, isChecked: boolean) => {
        productFilterStore.setSelectedCategories(id, isChecked);
    }

    const handlePriceFromChange = (value: string) => {
        setPriceFromValue(value);
        console.log(value)
        const numValue = value ? Number(value) : null;
        if (numValue !== null && !isNaN(numValue)) {
            console.log('set')
            productFilterStore.setPriceFrom(numValue);
        } else if (value === '') {
            productFilterStore.setPriceFrom(null);
        }
    }

    const handlePriceToChange = (value: string) => {
        setPriceToValue(value);
        const numValue = value ? Number(value) : null;
        if (numValue !== null && !isNaN(numValue)) {
            productFilterStore.setPriceTo(numValue);
        } else if (value === '') {
            productFilterStore.setPriceTo(null);
        }
    }

    const handleResetFilters = () => {
        productFilterStore.resetFilters();
        setPriceFromValue('');
        setPriceToValue('');
    }

    const handleSaveChanges = () => {
        productFilterStore.setIsOpen(false);
    }

    const categories = categoryStore.currentCategories();
    const selectedCategories = productFilterStore.selectedCategories;

    return (
        <>
            {productFilterStore.isOpen && (
                <>
                    <div className={s.cart__overlay}></div>
                    <aside className={s.filter}>
                        <CloseIcon 
                            className={cn(s['close-icon'], s.filter__close)} 
                            color="accent" 
                            onClick={() => productFilterStore.setIsOpen(false)}
                        />
                        <Text view='title' className={s.title}>Filter</Text>

                        <div>
                            <Text view='subtitle' className={s.subtitle}>Price</Text>
                            <div className={s.price}>
                                <Text view='p-18'>from</Text>
                                <Input 
                                    className={s.input} 
                                    placeholder="Initial sum" 
                                    value={priceFromValue}
                                    onChange={handlePriceFromChange}
                                    afterSlot={<></>}
                                />
                                <Text view='p-18'>to</Text>
                                <Input 
                                    className={s.input} 
                                    placeholder="Final sum" 
                                    value={priceToValue}
                                    onChange={handlePriceToChange}
                                    afterSlot={<></>}
                                />
                            </div>
                        </div>

                        <Text view='subtitle' className={s.subtitle}>Categories</Text>

                        <div className={s.categories}>
                            {
                                categories.map(category => (
                                    <div className={s.category} key={category.id}>
                                        <CheckBox 
                                            checked={selectedCategories[category.id] ?? true} 
                                            onChange={(isChecked: boolean) => handleCheckBoxChange(category.id, isChecked)}
                                        />
                                        <Text view='p-18'>{category.name}</Text>
                                    </div>
                                ))
                            }
                        </div>

                        <Text view='subtitle' className={s.subtitle}>Items</Text>
                        
                        <MultiDropdown 
                            className={s.items} 
                            options={ProductsStore.options} 
                            onChange={handleMultiDropdownChange} 
                            getTitle={getTitle} 
                            value={productFilterStore.selectedItems}
                        />

                        <ButtonsGroup 
                            leftText="Save changes" 
                            rightText="Reset the filter" 
                            onRightClick={handleResetFilters} 
                            onLeftClick={handleSaveChanges} 
                            className={s.buttons}
                        />
                    </aside>
                </>
            )}
        </>
    )
}

export default observer(Filter);
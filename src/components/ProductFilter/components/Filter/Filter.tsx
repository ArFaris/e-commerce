import MultiDropdown from "components/MultiDropdown"
import ProductsStore from "store/ProductsStore"
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
import { useMemo } from "react";
import filterStore from 'store/FilterStore';

const Filter: React.FC = () => {
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

    useMemo(() => {
        const loadCategories = async () => {
            await categoryStore.loadCategories()
        }

        loadCategories();
    }, []);

    const handleCheckBoxChange = (id: string, isChecked: boolean) => {
        console.log('is checked', isChecked)
        console.log('id', id);
        filterStore.setSelectedCategories(id, isChecked);
    }

    return (
        <>
            {filterStore.isOpen && (
                <>
                    <div className={s.cart__overlay}></div>
                    <aside className={s.filter}>
                        <CloseIcon className={cn(s['close-icon'], s.filter__close)} color="accent" onClick={() => filterStore.setIsOpen(false)}/>
                        <Text view='title' className={s.title}>Filter</Text>

                        <div>
                            <Text view='subtitle' className={s.subtitle}>Price</Text>
                            <div className={s.price}>
                                <Text view='p-18'>from</Text>
                                    <Input className={s.input} placeholder="Initial sum" afterSlot={<></>}/>
                                <Text view='p-18'>to</Text>
                                    <Input className={s.input} placeholder="Final sum" afterSlot={<></>}/>
                            </div>
                        </div>

                        <Text view='subtitle' className={s.subtitle}>Categories</Text>

                        <div className={s.categories}>
                            {
                                categoryStore.currentCategories().map(category => (
                                    <div className={s.category} key={category.id}>
                                        <CheckBox checked={filterStore.isCategoriesChecked[category.id]} onChange={(isChecked: boolean) => handleCheckBoxChange(category.id, isChecked)}/>
                                        <Text view='p-18'>{category.name}</Text>
                                    </div>
                                ))
                            }
                        </div>

                        <Text view='subtitle' className={s.subtitle}>Items</Text>
                        
                        <MultiDropdown className={s.items} options={ProductsStore.options} onChange={(e) => handleMultiDropdownChange(e)} getTitle={(options: Option[]) => getTitle(options)} value={ProductsStore.selectedOptions}/>

                        <ButtonsGroup leftText="Save changes" rightText="Reset the filter" onRightClick={() => {}} onLeftClick={() => {}} className={s.buttons}/>
                    </aside>
                </>
            )}
        </>
    )
}

export default observer(Filter);

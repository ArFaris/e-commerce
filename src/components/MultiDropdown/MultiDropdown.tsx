import React from 'react';
import Input from '../Input';
import Text from 'components/Text'
import s from './MultiDropdown.module.scss';
import cn from 'classnames';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';

export type Option = {
    value: string;
    key: string;
}

/** Пропсы, которые принимает компонент Dropdown */
export type MultiDropdownProps = {
  className?: string;
  /** Массив возможных вариантов для выбора */
  options: Option[];
  /** Текущие выбранные значения поля, может быть пустым */
  value: Option[];
  /** Callback, вызываемый при выборе варианта */
  onChange: (value: Option[]) => void;
  /** Заблокирован ли дропдаун */
  disabled?: boolean;
  /** Возвращает строку которая будет выводится в инпуте. В случае если опции не выбраны, строка должна отображаться как placeholder. */
  getTitle: (value: Option[]) => string;
};

const MultiDropdown: React.FC<MultiDropdownProps> = ({className, options, value, onChange, disabled, getTitle}: MultiDropdownProps) => {
    
    const wrapperRef = useRef<HTMLDivElement>(null);
    const ref = useRef<HTMLInputElement>(null);
    const [filter, setFilter] = useState('');
    const [isOpened, setIsOpened] = useState(false);

    const open = () => {
        setIsOpened(true);
    }

    useEffect(() => {
        const handlerClick = (e: MouseEvent) => {
            if (!wrapperRef.current?.contains(e.target as HTMLElement)) {
                setIsOpened(false);
            }
        }

        window.addEventListener('click', handlerClick);

        return () => {
            window.removeEventListener('click', handlerClick);
        }
    }, []);

     
    useEffect(() => {
        if (!isOpened) {
             // eslint-disable-next-line react-hooks/set-state-in-effect
            setFilter('');
        }
    }, [isOpened]);

    const title = useMemo(() => getTitle(value), [getTitle, value]);

    const isEmpty = value.length === 0;

    const filteredOptions = useMemo(() => {
        const str = filter.toLocaleLowerCase();

        return options.filter((o) => o.value.toLocaleLowerCase().indexOf(str) === 0);
    }, [filter, options]);

    const selectedKeysSet = useMemo<Set<Option['key']>>(
        () =>
            new Set(value.map(({key}) => key)),
        [value]
    );

    const onSelect = useCallback(
        (option: Option) => {
            if (disabled) {
                return;
            }

            if (selectedKeysSet.has(option.key)) {
                onChange([...value].filter(({key}) => key !== option.key));
            } else {
                onChange([...value, option])
            }

            ref.current?.focus();
        },
        [disabled, onChange, value, selectedKeysSet]
    );

    return (
        <div ref={wrapperRef} className={cn(s['multi-dropdown'], className)}>
            <Input
                onClick={open}
                disabled={disabled}
                placeholder={title || 'Filter'}
                className={s['multi-dropdown__field']}
                value={isOpened && !disabled ? filter : isEmpty ? '' : title}
                onChange={setFilter}
            />
            {
                isOpened && !disabled && (
                    <div className={s['multi-dropdown__options']}>
                        {filteredOptions.map((option) => (
                            <button
                                className={cn(
                                    s['multi-dropdown__option'],
                                    selectedKeysSet.has(option.key) && 
                                        s['multi-dropdown__option_selected']
                                )}
                                key={option.key}
                                onClick={() => {
                                    onSelect(option);
                                }}
                            >
                                <Text view="p-16">
                                    {option.value}
                                </Text>
                            </button>
                        ))}
                    </div>
                )
            }
        </div>
    );
};

export default MultiDropdown;
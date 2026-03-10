import React, { useState } from 'react';
import cn from 'classnames';
import s from './Input.module.scss';
import ArrowDownIcon from '../icons/ArrowDownIcon';

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> & {
  /** Значение поля */
  value?: string;
  /** Callback, вызываемый при вводе данных в поле */
  onChange?: (value: string) => void;
  /** Слот для иконки справа */
  afterSlot?: React.ReactNode;
};

const Input: React.FC<InputProps> = ({
  value, 
  onChange, 
  afterSlot = <ArrowDownIcon color="secondary"/>, 
  className, 
  placeholder,
  ...props}) =>
{
  const [searchText, setSearchText] = useState('');

  const handleInputChange = (currentValue: string) => {
      setSearchText(currentValue);
  }

  if (!onChange) onChange = handleInputChange;
  if (!value) value = searchText;

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      onChange(event.target.value);
    },
    [onChange]
  );

  return (
    <div className={cn(className, s.input)}>
      <input type="text" value={value} {...props} placeholder={placeholder || 'Текст'} onChange={handleChange}/>
      <div className={s.input__after}>
        {afterSlot}
      </div>
    </div>
  );
};

export default Input;
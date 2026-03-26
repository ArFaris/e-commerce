import React from 'react';
import cn from 'classnames';
import s from './CheckBox.module.scss';
import CheckIcon from '../icons/CheckIcon';

export type CheckBoxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  onChange: (checked: boolean) => void;
};

const CheckBox = ({onChange, ...props}: CheckBoxProps) => {
  return (
    <label className={cn(props.className, s.checkbox)}>
      <input type="checkbox" onChange={(e) => onChange(e.target.checked)} {...props}/>
      <span className={s.checkbox__box}>
        {props.checked && <CheckIcon viewBox="0 0 24 24" width='40' height='40' color={props.disabled ? "secondary" : "accent"}/>}
      </span>
    </label>
  );
};

export default CheckBox;

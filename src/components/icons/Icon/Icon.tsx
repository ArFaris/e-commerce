import * as React from 'react';
import s from './icon.module.scss';
import cn from 'classnames';

export type IconProps = React.SVGAttributes<SVGElement> & {
  className?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'header';
};

const Icon: React.FC<IconProps> = ({
  children,
  width = 24,
  height = 24,
  color,
  className,
  ...props
}) => {
  return (
        <svg
          data-testid="icon"
          width={width}
          height={height}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(s[`color-${color}`], className)}
          {...props}
        >
          {children}
        </svg>
  );
};

export default Icon;

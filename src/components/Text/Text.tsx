import * as React from 'react'
import cn from 'classnames';
import s from './Text.module.scss';

export type TextProps = {
    /** Дополнительный класс */
    className?: string;
    /** Стиль отображения */
    view?: 'title' | 'subtitle' | 'button' | 'p-20' | 'p-18' | 'p-16' | 'p-14';
    /** Html-тег */
    tag?:  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p' | 'span';
    /** Начертание шрифта */
    weight?: 'normal' | 'medium' | 'bold';
    /** Контент */
    children: React.ReactNode;
    /** Цвет */
    color?: 'primary' | 'secondary' | 'accent';
    /** Максимальное кол-во строк */
    maxLines?: number;

    onClick?: () => void;
};

const Text: React.FC<TextProps> = ({ className, view, tag, weight, children, color, maxLines, onClick }: TextProps) => {
    const Tag = tag || 'p';

    return (
        <Tag className={cn(s.text, s[`text_view-${view}`], weight && s[`text_weight-${weight}`], color && s[`text_color-${color}`],
            maxLines, className)} onClick={onClick}
            style={
                { '--max-lines-count': maxLines } as React.CSSProperties
            }
            >{children}</Tag>
    );
};

export default Text;

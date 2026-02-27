import React from 'react';
import Text from '../Text';
import s from './Card.module.scss';
import cn from 'classnames';

export type CardProps = {
    /** Дополнительный classname */
    className?: string,
    /** URL изображения */
    image: string;
    /** Слот над заголовком */
    captionSlot?: React.ReactNode;
    /** Заголовок карточки */
    title: React.ReactNode;
    /** Описание карточки */
    subtitle: React.ReactNode;
    /** Содержимое карточки (футер/боковая часть), может быть пустым */
    contentSlot?: React.ReactNode;
    /** Клик на карточку */
    onClick?: React.MouseEventHandler;
    /** Слот для действия */
    actionSlot?: React.ReactNode;
};

const Card: React.FC<CardProps> = ({className, image, captionSlot, title, subtitle, contentSlot, onClick, actionSlot}: CardProps) => {
  return (
    <article className={cn(s.card, className)} onClick={onClick}>
      <div className={s.image__wrapper}><img src={image}/></div>
      <div className={s.card__content}>
        <div className={s.card__text}>
          <div className={s.card__caption}>{captionSlot}</div>
          <Text maxLines={2} color='primary' view={'p-20'} weight='bold'>{title}</Text>
          <Text maxLines={3} color='secondary' view={'p-16'}>{subtitle}</Text>
        </div>
        <div className={s.card__action}>
          <div className={s.card__price}><b>{contentSlot}</b></div>
          {actionSlot}
        </div>
      </div>
    </article>
  );
};

export default Card;
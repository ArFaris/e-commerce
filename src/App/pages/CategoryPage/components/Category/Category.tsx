import Text from 'components/Text';
import cn from 'classnames';
import s from './Category.module.scss';

type CategoryProps = {
    imgSrc: string,
    name: string,
    description?: string,
    className?: string
}

const Category: React.FC<CategoryProps> = ({imgSrc, name, description, className, ...props}: CategoryProps) => {
    return (
        <article className={cn(s.card, className)} {...props}>
            <img className={s.image} src={imgSrc}/>

            <Text className={cn(s.text, s.text_name)} view="subtitle">{name}</Text>
            <Text className={s.text} view="p-20" color="secondary">{description}</Text>
        </article>
    );
}

export default Category;
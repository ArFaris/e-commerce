import s from "./OrderPage.module.scss";
import { useCartProducts } from 'App/App';
import { useNavigate } from "react-router";
import Card from "components/Card";
import Text from 'components/Text';

const OrderPage = () => {
    const navigate = useNavigate();
    const {productsInCart, setProductsInCart} = useCartProducts();

    return (
        <section className={s.page}>
            <div className={s.content}>
                <div className={s.cards}>
                    {
                        productsInCart?.order.map((id: string) => { 
                        const product = productsInCart.entities[id].product;
                        const count = productsInCart.entities[id].count;
                        return <Card
                            className={s.card}
                            image={`/public/products/${product.image}.png`}
                            captionSlot={<>{product.captionSlot}</>}
                            title={<>{product.title}</>}
                            subtitle={<></>}
                            contentSlot={<>{product.contentSlot}</>}
                            actionSlot={<>{`${count} lot`}</>}
                        />})
                    }
                </div>

                <div className={s.text}>
                    <Text view="title">Order</Text>
                </div>
            </div>

        </section>
    );
}

export default OrderPage;
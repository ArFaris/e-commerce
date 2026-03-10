import Header from 'components/Header';
import { Outlet } from 'react-router';
import { useContext } from 'react';
import { type CollectionModel } from 'shared/collection';
import type { Product } from 'types/product';
import React from 'react';
import useCartWithStorage from 'hooks/useCartWithStorage';

export type CartProductsContextType = {
  productsInCart: CollectionModel<string, {product: Product, count: number}>;
  setProductsInCart: React.Dispatch<React.SetStateAction<CollectionModel<string, {product: Product, count: number}>>>;
}

export const CartProductsContext = React.createContext<CartProductsContextType | undefined>(undefined);

export const useCartProducts = () => {
  const context = useContext(CartProductsContext);
  if (!context) {
    throw new Error('useCartProducts must be used within CartProductsContext.Provider');
  }
  return context;
}

const App = () => {
  const {productsInCart, setProductsInCart} = useCartWithStorage();

  return (
    <CartProductsContext.Provider value={{productsInCart, setProductsInCart}}>
      <Header />
      <Outlet />
    </CartProductsContext.Provider>
  )
}

export default App;

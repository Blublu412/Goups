import React, {createContext, useState, useContext, ReactNode} from 'react';

interface CartContextType {
    cart_id: number;
    assignCart: (id: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({children}) =>{
    const [cart_id,setCartId] = useState(0);

    const assignCart = (id: number)=>{
        setCartId(id);
    };

    return (
        <CartContext.Provider value={{cart_id, assignCart}}>
            {children}
        </CartContext.Provider>
    )
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart doit être utilisé à l\'intérieur d\'un CartProvider');
    }
    return context;
};
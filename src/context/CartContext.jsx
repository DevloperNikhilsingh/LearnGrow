import { createContext, useContext, useEffect, useState } from "react";

const cartContext = createContext(null);
const STORAGE_KEY = 'cart';

export function CartProvider({ children }) {

    const [cartItem, setCartItem] = useState(() => {
        try {
            const store = localStorage.getItem(STORAGE_KEY);
            return store ? JSON.parse(store) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItem));
    }, [cartItem]);

    const addToCart = (course) => {
        setCartItem((prev) => {
            const existing = prev.find((item) => item.slug === course.slug);

            if (existing) {
                alert("This course is already in your cart");
                return prev; // state ko waisa hi chhodo, undefined mat return karo
            }

            return [...prev, { ...course, quantity: 1 }];
        });
    }

    const removeFromCart = (slug) => {
        setCartItem((prev) => prev.filter((item) => item.slug !== slug));
    }

    const clearCart = () => {
  setCartItem([]); // ya jo bhi aapka cart state variable hai
  localStorage.removeItem('cart'); // agar localStorage use ho raha hai to
};

    const cartCount = cartItem.reduce((sum, item) => sum + item.quantity, 0);

    const cartTotal = cartItem.reduce(
        (sum, item) => sum + (item.isFree ? 0 : item.price * item.quantity),
        0
    );

    return (
        <cartContext.Provider
            value={{
                cartItem,
                addToCart,
                removeFromCart,
                cartTotal,
                cartCount,
                clearCart
            }}
        >
            {children}
        </cartContext.Provider>
    );

}

export function useCart() {
    const context = useContext(cartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
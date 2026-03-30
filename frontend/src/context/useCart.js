// useCart.js — hook only
import { useContext } from "react";
import { CartContext } from "./cartContext";

export const useCart = () => useContext(CartContext);

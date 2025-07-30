'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Define wishlist item type
interface WishlistItem {
  id: string;
  title: string;
  description?: string;
  posterUrl?: string;
  releaseYear?: number;
  genre?: string;
  director?: string;
  type: 'MOVIE' | 'TV_SERIES';
  addedAt: string;
}

// Define wishlist state
interface WishlistState {
  items: WishlistItem[];
  itemCount: number;
}

// Define wishlist actions
type WishlistAction =
  | { type: 'ADD_ITEM'; payload: WishlistItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'SET_WISHLIST'; payload: WishlistItem[] };

// Wishlist context type
interface WishlistContextType {
  state: WishlistState;
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  clearWishlist: () => void;
  isInWishlist: (id: string) => boolean;
}

// Initial state
const initialState: WishlistState = {
  items: [],
  itemCount: 0,
};

// Wishlist reducer
const wishlistReducer = (
  state: WishlistState,
  action: WishlistAction
): WishlistState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        item => item.id === action.payload.id
      );
      if (existingItem) {
        return state; // Item already in wishlist
      }

      const newItems = [...state.items, action.payload];
      return {
        items: newItems,
        itemCount: newItems.length,
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return {
        items: newItems,
        itemCount: newItems.length,
      };
    }

    case 'CLEAR_WISHLIST':
      return initialState;

    case 'SET_WISHLIST': {
      return {
        items: action.payload,
        itemCount: action.payload.length,
      };
    }

    default:
      return state;
  }
};

// Create context
const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

// Wishlist provider component
export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  const addItem = (item: WishlistItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  };

  const isInWishlist = (id: string) => {
    return state.items.some(item => item.id === id);
  };

  const contextValue: WishlistContextType = {
    state,
    addItem,
    removeItem,
    clearWishlist,
    isInWishlist,
  };

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
}

// Custom hook to use wishlist context
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

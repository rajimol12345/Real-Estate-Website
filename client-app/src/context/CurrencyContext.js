import React, { createContext, useState, useEffect } from 'react';

export const CurrencyContext = createContext();

export const CURRENCIES = [
    { symbol: '$', label: 'Usd', code: 'USD', rate: 1.0 },
    { symbol: '£', label: 'Pound', code: 'GBP', rate: 0.78 },
    { symbol: '¥', label: 'Yen', code: 'JPY', rate: 150.0 },
    { symbol: '€', label: 'Euro', code: 'EUR', rate: 0.92 },
];

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState(() => {
        const saved = localStorage.getItem('currency');
        if (saved) {
            const parsed = JSON.parse(saved);
            return CURRENCIES.find(c => c.code === parsed.code) || CURRENCIES[0];
        }
        return CURRENCIES[0];
    });

    useEffect(() => {
        localStorage.setItem('currency', JSON.stringify(currency));
    }, [currency]);

    const formatPrice = (priceInUsd) => {
        if (!priceInUsd) return '';

        const convertedPrice = priceInUsd * currency.rate;
        const decimals = currency.code === 'JPY' ? 0 : 2;

        return convertedPrice.toLocaleString('en-US', {
            style: 'currency',
            currency: currency.code,
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, CURRENCIES }}>
            {children}
        </CurrencyContext.Provider>
    );
};

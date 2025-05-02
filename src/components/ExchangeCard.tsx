"use client";

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaExchangeAlt, FaDollarSign, FaArrowDown, FaUniversity, FaSync } from 'react-icons/fa';

interface ExchangeRate {
  moneda: string;
  casa: string;
  nombre: string;
  compra: number | null;
  venta: number | null;
  fechaActualizacion: string;
}

type ConversionDirection = 'USD_TO_BOB' | 'BOB_TO_USD';

const ExchangeCard = () => {
  const [rate, setRate] = useState<ExchangeRate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(100);
  const [inputValue, setInputValue] = useState<string>("100");
  const [selectedMethod, setSelectedMethod] = useState<string>('transfer');
  const [conversionDirection, setConversionDirection] = useState<ConversionDirection>('BOB_TO_USD');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Función para obtener las tasas de cambio
  const fetchRate = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      else setIsRefreshing(true);
      
      const response = await axios.get('https://bo.dolarapi.com/v1/dolares/binance');
      setRate(response.data);
      setLastUpdate(new Date());
      
      // Inicializar con valores para BOB_TO_USD si es la primera carga
      if (showLoading && conversionDirection === 'BOB_TO_USD' && response.data.venta) {
        const initialBobAmount = 1000;
        setAmount(initialBobAmount);
        setInputValue(initialBobAmount.toString());
      }
      
      if (showLoading) setLoading(false);
      else setIsRefreshing(false);
      
      // Limpiar cualquier error previo
      if (error) setError(null);
      
    } catch (err) {
      setError('Error al obtener las tasas de cambio. Por favor, intente más tarde.');
      if (showLoading) setLoading(false);
      else setIsRefreshing(false);
    }
  }, [conversionDirection, error]);

  // Cargar datos iniciales
  useEffect(() => {
    fetchRate();
    
    // Configurar actualización automática cada 60 segundos
    const interval = setInterval(() => {
      fetchRate(false);
    }, 60000);
    
    // Limpiar intervalo al desmontar
    return () => clearInterval(interval);
  }, [fetchRate]);

  // Calcular el precio de compra (venta - 2%)
  const calculateBuyRate = (sellRate: number | null): number => {
    if (sellRate === null) return 0;
    return +(sellRate * 0.98).toFixed(2);
  };

  // Calcular el monto en bolivianos o dólares
  const calculateConvertedAmount = (): number => {
    if (!rate?.venta) return 0;
    
    if (conversionDirection === 'USD_TO_BOB') {
      // USD a BOB - usar tasa de compra (venta - 2%)
      const buyRate = calculateBuyRate(rate.venta);
      return +(amount * buyRate).toFixed(2);
    } else {
      // BOB a USD - usar tasa de venta
      return +(amount / rate.venta).toFixed(2);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Solo permitir números y un punto decimal
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setInputValue(value);
      
      // Convertir a número si es válido
      const numValue = parseFloat(value || "0");
      if (!isNaN(numValue)) {
        setAmount(numValue);
      }
    }
  };

  const handleAmountFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const incrementAmount = () => {
    const step = conversionDirection === 'USD_TO_BOB' ? 10 : 100;
    const newAmount = amount + step;
    setAmount(newAmount);
    setInputValue(newAmount.toString());
  };

  const decrementAmount = () => {
    const step = conversionDirection === 'USD_TO_BOB' ? 10 : 100;
    if (amount >= step) {
      const newAmount = amount - step;
      setAmount(newAmount);
      setInputValue(newAmount.toString());
    }
  };

  const toggleConversionDirection = () => {
    // Resetear valores al cambiar la dirección
    if (conversionDirection === 'USD_TO_BOB') {
      setConversionDirection('BOB_TO_USD');
      setAmount(100 * (rate?.venta || 15));  // Aproximado
      setInputValue((100 * (rate?.venta || 15)).toString());
    } else {
      setConversionDirection('USD_TO_BOB');
      setAmount(100);
      setInputValue("100");
    }
  };

  const handleRefreshRates = () => {
    fetchRate(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="h-32 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <button 
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => fetchRate()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const buyRate = rate ? calculateBuyRate(rate.venta) : 0;
  const convertedAmount = calculateConvertedAmount();
  const fromCurrency = conversionDirection === 'USD_TO_BOB' ? 'USD' : 'BOB';
  const toCurrency = conversionDirection === 'USD_TO_BOB' ? 'BOB' : 'USD';
  const presetAmounts = conversionDirection === 'USD_TO_BOB' 
    ? [50, 100, 500, 1000] 
    : [500, 1000, 5000, 10000];
  
  // Formatear tiempo de última actualización
  const formatTimeAgo = () => {
    if (!lastUpdate) return '';
    
    const seconds = Math.floor((new Date().getTime() - lastUpdate.getTime()) / 1000);
    
    if (seconds < 60) return `hace ${seconds} segundos`;
    if (seconds < 3600) return `hace ${Math.floor(seconds / 60)} minutos`;
    return `hace ${Math.floor(seconds / 3600)} horas`;
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-blue-100 p-3 rounded-full">
          <FaDollarSign className="text-blue-600 text-2xl" />
        </div>
        <h2 className="text-2xl font-bold ml-3 text-gray-800">Cambio de Divisas</h2>
      </div>

      <div className="flex justify-between mb-6 bg-gray-100 rounded-lg p-1">
        <button
          type="button"
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
            conversionDirection === 'BOB_TO_USD'
              ? 'bg-white shadow text-blue-700'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setConversionDirection('BOB_TO_USD')}
        >
          BOB → USD
        </button>
        <button
          type="button"
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
            conversionDirection === 'USD_TO_BOB'
              ? 'bg-white shadow text-blue-700'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setConversionDirection('USD_TO_BOB')}
        >
          USD → BOB
        </button>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Tasa de compra:</span>
          <span className="font-semibold text-gray-800">{buyRate} BOB</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Tasa de venta:</span>
          <span className="font-semibold text-gray-800">{rate?.venta} BOB</span>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
          <span>
            Actualizado: {lastUpdate ? formatTimeAgo() : ''}
          </span>
          <button 
            className={`text-blue-600 flex items-center ${isRefreshing ? 'animate-spin' : 'hover:underline'}`}
            onClick={handleRefreshRates}
            disabled={isRefreshing}
          >
            <FaSync className="mr-1" size={12} />
            Actualizar
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Monto en {fromCurrency}
        </label>
        <div className="relative flex items-center">
          <button 
            type="button"
            onClick={decrementAmount}
            className="absolute left-0 h-full px-3 text-gray-600 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg hover:bg-gray-200 focus:outline-none"
            disabled={amount < (conversionDirection === 'USD_TO_BOB' ? 10 : 100)}
          >
            -
          </button>
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-12 pointer-events-none">
              <span className="text-gray-500">
                {conversionDirection === 'USD_TO_BOB' ? '$' : 'Bs'}
              </span>
            </div>
            <input
              type="text"
              id="amount"
              value={inputValue}
              onChange={handleAmountChange}
              onFocus={handleAmountFocus}
              placeholder={`Ingrese monto en ${fromCurrency}`}
              className="w-full p-3 pl-20 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              min="0"
            />
            <div className="absolute inset-y-0 right-12 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500 text-sm">{fromCurrency}</span>
            </div>
          </div>
          <button 
            type="button"
            onClick={incrementAmount}
            className="absolute right-0 h-full px-3 text-gray-600 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 focus:outline-none"
          >
            +
          </button>
        </div>
        <div className="flex justify-between items-center mt-2">
          {presetAmounts.map((preset) => (
            <button 
              key={preset}
              type="button" 
              className="text-xs text-blue-600 hover:underline"
              onClick={() => {
                setAmount(preset);
                setInputValue(preset.toString());
              }}
            >
              {conversionDirection === 'USD_TO_BOB' ? '$' : 'Bs'}{preset}
            </button>
          ))}
        </div>
      </div>

      <div className="relative py-4 flex justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="border-t border-gray-300 w-full"></div>
        </div>
        <button 
          className="relative bg-white p-2 rounded-full border border-gray-300 z-10 hover:bg-blue-50"
          onClick={toggleConversionDirection}
        >
          <FaExchangeAlt className="text-blue-600" />
        </button>
      </div>

      <div className="mb-6 bg-green-50 p-4 rounded-lg">
        <div className="text-center">
          <p className="text-gray-600 mb-2">Recibirás</p>
          <p className="text-3xl font-bold text-green-600">
            {conversionDirection === 'USD_TO_BOB' ? 'Bs ' : '$ '}
            {convertedAmount.toLocaleString('es-BO', {maximumFractionDigits: 2})} 
            {toCurrency}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Método de pago
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className={`flex items-center justify-center p-3 rounded-lg border ${
              selectedMethod === 'transfer' 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-300 text-gray-600'
            }`}
            onClick={() => setSelectedMethod('transfer')}
          >
            <FaUniversity className="mr-2" />
            <span>Transferencia</span>
          </button>
          <button
            type="button"
            className={`flex items-center justify-center p-3 rounded-lg border ${
              selectedMethod === 'cash' 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-300 text-gray-600'
            }`}
            onClick={() => setSelectedMethod('cash')}
          >
            <FaDollarSign className="mr-2" />
            <span>Efectivo</span>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">Detalles bancarios:</p>
        <div className="bg-gray-50 p-3 rounded border border-gray-200">
          <p className="text-gray-700">Por definir</p>
        </div>
      </div>

      <button
        type="button"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
      >
        <FaExchangeAlt className="mr-2" />
        Realizar intercambio
      </button>
    </div>
  );
};

export default ExchangeCard; 
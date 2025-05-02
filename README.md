# Wallbol Exchange

Aplicación web para intercambio de divisas entre dólares americanos (USD) y bolivianos (BOB).

## Características

- Conversión de USD a BOB y BOB a USD
- Tasas de cambio actualizadas automáticamente
- Interfaz de usuario moderna y responsive
- Opciones de pago: transferencia bancaria y efectivo
- Calculadora integrada con presets de cantidades comunes
- Actualización automática de tasas cada 60 segundos

## Tecnologías utilizadas

- Next.js 15.3
- React 19
- TypeScript
- Tailwind CSS
- Axios para llamadas API

## API

La aplicación utiliza la siguiente API para obtener las tasas de cambio:
- Endpoint: https://bo.dolarapi.com/v1/dolares/binance

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Alain-Colombia-Arbitrage-Mev/waiboExchange.git

# Navegar al directorio del proyecto
cd waiboExchange

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

## Uso

1. Selecciona la dirección de conversión (BOB → USD o USD → BOB)
2. Ingresa el monto a convertir
3. Observa el monto convertido en tiempo real
4. Selecciona el método de pago
5. Haz clic en "Realizar intercambio" para completar la transacción

## Licencia

MIT

## Autor

Alain Colombia Arbitrage Mev

import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Form } from './components/Form';
import { useExchangeRates } from './data/rates';
import { TCurrency } from './models';

export function Home() {
  const { isLoading, data: rates } = useExchangeRates();
  const currencies = useMemo(() => {
    const result = new Set<TCurrency>();
    rates?.forEach((rate) => result.add(rate.code));
    return Array.from(result);
  }, [rates]);
  return (<View><Form rates={rates ?? []} currencies={currencies} /></View>);
}

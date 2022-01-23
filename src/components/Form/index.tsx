import React, { useCallback, useState } from 'react';
import {View , Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';

import { TCurrency, IExchangeRate } from '../../models';

interface ConvertFormProps {
  rates: IExchangeRate[];
  currencies: TCurrency[];
}

export function Form({ rates, currencies }: ConvertFormProps) {
  const [convertedValue, setConvertedValue] = useState<
    undefined | { amount: number; currency: string }
  >(undefined);

  const [currencyAmount, setCurrencyAmount] = useState(0);
  const [currencySelection, setCurrencySelection] = useState(0);
  const onChangeAmount = useCallback((value) => {
    setCurrencyAmount(value);
  });
  
  const onSubmit =  () => {
      if(currencyAmount !== 0){
      const value = currencyAmount;
      const rate = rates.find((r) => r.code === currencies[currencySelection]);
      if (!rate) {
        setConvertedValue(undefined);
        return;
      }
      setConvertedValue({
        amount: (rate.amount * value) / rate.rate,
        currency: currencies[currencySelection],
      });
    }
    
    }
    
  return (
    <View style={styles.container}>
      <Text style={styles.label}>CKZ *</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeAmount}
        value={currencyAmount}
        placeholder="Enter Amount CKZ"
        keyboardType="numeric"
      />
      <View style={styles.dropDown}>
      <ModalDropdown options={currencies} onSelect = {index => {
        setCurrencySelection(index);
        }}
        isFullWidth
      />
    </View>

      <TouchableOpacity onPress={onSubmit} style={styles.convertButton}>
        <Text>Convert</Text>
      </TouchableOpacity>
      {convertedValue ? (  
          <View><Text>Result ${convertedValue.amount.toFixed(2)} ${convertedValue.currency}</Text></View>
            ) : null}
    </View>
      
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  convertButton: {
    backgroundColor: 'lightblue',
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  label: {
    paddingHorizontal: 10,
  },
  dropDown: {
    borderWidth: 1, borderColor: 'black', padding: 10, margin: 10
  }
});

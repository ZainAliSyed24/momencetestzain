import React, { useCallback, useState } from 'react';
import ModalDropdown from 'react-native-modal-dropdown';
import styled from 'styled-components/native';

import { TCurrency, IExchangeRate } from '../../models';
import { Button } from '../Button';

const ButtonText = styled.Text`
  color: black;
`;
const LabelText = styled.Text`
  padding-horizontal: 10;
`;
const Result = styled.View``;
const Container = styled.View`
  padding-horizontal: 10;
`;
const Input = styled.TextInput`
  height: 40;
  margin-horizontal: 12;
  margin-vertical: 12;
  border-width: 1;
  padding-horizontal: 10;
  padding-vertical: 10;
`;
const ModalContainer = styled.View`
  border-width: 1;
  border-color: black;
  padding: 10px 10px;
  margin: 10px 10px;
`;

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
  const onChangeAmount = useCallback((value) => { setCurrencyAmount(value);});
  const onSubmit = () => {
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
    <Container>
      <LabelText>CKZ *</LabelText>
      <Input placeholder="Enter Amount CKZ" keyboardType="numeric" onChangeText={onChangeAmount} value={currencyAmount} />
      <ModalContainer>  
        <ModalDropdown options={currencies} onSelect = {index => {
          setCurrencySelection(index);
          }}
          isFullWidth
        />
      </ModalContainer>
    
      <Button onPress={onSubmit}>
        <ButtonText>Convert</ButtonText>
      </Button>
      {convertedValue ? (
        <Result>
          <ButtonText>
            Result ${convertedValue.amount.toFixed(2)}
            ${convertedValue.currency}
          </ButtonText>
        </Result>
      ) : null}
    </Container>
  );
}

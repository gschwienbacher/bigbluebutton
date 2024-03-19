import React from 'react';
import Styled from './styles';

const LoadingScreen = ({ children }) => (
  <Styled.Background>
    <Styled.Spinner animations>
      <Styled.Bounce1 animations />
      <Styled.Bounce2 animations />
      <div />
    </Styled.Spinner>
    <Styled.Message>
      {children}
    </Styled.Message>
  </Styled.Background>
);

export default LoadingScreen;

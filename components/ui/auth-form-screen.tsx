import React from 'react';
import { StyleSheet, View } from 'react-native';

import GenericInput from './generic-input';
import PhoneNumberInput from './phone-number-input';

const AuthFormScreen: React.FC = () => {
  const staticEmail = 'exampleemail@ru.edu';
  const staticPassword = 'Password';

  const phoneNumberProps = {
    label: 'PHONE NUMBER',
    extension: 'MM',
    value: '000000000',
  };

  return (
    <View style={styles.container}>
      <GenericInput
        label="EMAIL"
        placeholder="exampleemail@ru.edu"
        type="email"
        defaultValue={staticEmail}
      />

      <GenericInput
        label="PASSWORD"
        placeholder="Password"
        type="password"
        defaultValue={staticPassword}
      />

      <PhoneNumberInput
        label={phoneNumberProps.label}
        extension={phoneNumberProps.extension}
        value={phoneNumberProps.value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 25,
    paddingTop: 50,
  },
});

export default AuthFormScreen;

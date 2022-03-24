import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import {colors} from '_config';

const Button = props => {
  const {label, variant, color, onPress, style, loading, disabled, ...rest} =
    props;

  return (
    <TouchableOpacity
      title={label}
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        style,
        styles.button,
        !rest.notRounded && styles.buttonRounded,
        loading || disabled ? styles.buttonOpacity : null,
      ]}
      disabled={loading || disabled}
      {...rest}>
      {loading && (
        <ActivityIndicator
          color={'#fff'}
          visible={true}
          style={styles.spinner}
        />
      )}
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 50,
    backgroundColor: colors.primary,
    padding: 20,
    shadowOffset: {width: 0, height: 5},
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  spinner: {
    marginRight: 8,
  },
  buttonOpacity: {
    opacity: 0.8,
  },
});

export default Button;

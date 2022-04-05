import React from 'react';
import PropTypes from 'prop-types';
import {Text, TextInput, StyleSheet} from 'react-native';
import {colors} from '_config';

/**
 * Input
 * @param {string} name
 * @param {string} type
 * @param {string} error
 * @param {boolean} touched
 */
const Input = ({name, type, error, onChange, touched, ...restProps}) => (
  <>
    <TextInput
      textContentType={type}
      placeholderTextColor={colors.muted}
      selectionColor={colors.ffa_blue_dark}
      autoCompleteType={restProps.autoCompleteType}
      style={{
        color: touched && error ? colors.red : colors.black,
        borderWidth: 2,
        borderColor: colors.muted,
        padding: 20,
        borderRadius: 50,
        marginBottom: touched && error ? 5 : 20,
        fontSize: 16,
      }}
      onChangeText={text => onChange(text)}
      multiline={false}
      {...restProps}
    />

    {touched && error && <Text style={styles.textError}>{error}</Text>}
  </>
);

Input.displayName = 'Input';

Input.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  error: PropTypes.string,
  touched: PropTypes.bool,
};

Input.defaultProps = {
  type: 'none',
  touched: false,
};

const styles = StyleSheet.create({
  textError: {
    marginBottom: 15,
    fontSize: 13,
    color: colors.red,
  },
});

export default Input;

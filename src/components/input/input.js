import React from 'react';
import PropTypes from 'prop-types';
import {Text, TextInput, StyleSheet, Platform} from 'react-native';
import {colors, styleSheet} from '_config';

const maxHeightField = 55;

/**
 * Input
 * @param {string} name
 * @param {string} type
 * @param {string} error
 * @param {boolean} touched
 */
const Input = ({
  name,
  type,
  error,
  onChange,
  onBlur,
  touched,
  ...restProps
}) => (
  <>
    <TextInput
      textContentType={type}
      placeholderTextColor={colors.muted}
      selectionColor={colors.ffa_blue_dark}
      autoCompleteType={restProps.autoCompleteType}
      style={[
        styles.textInput,
        styleSheet.text,
        styleSheet.backWhite,
        {
          color: touched && error ? colors.red : colors.black,
          marginBottom: touched && error ? 5 : 10,
        },
      ]}
      onChangeText={text => onChange(text)}
      onEndEditing={() => onBlur()}
      multiline={false}
      {...restProps}
    />

    {touched && error && <Text style={styleSheet.textError}>{error}</Text>}
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
  textInput: {
    borderWidth: 2,
    borderColor: colors.muted,
    padding: 15,
    borderRadius: Platform.OS === 'ios' ? 50 : 0,
    height: maxHeightField,
  },
});

export default Input;

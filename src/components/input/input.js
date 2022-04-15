import React from 'react';
import {Text, TextInput, StyleSheet, Platform} from 'react-native';
import {colors, styleSheet} from '_config';

const MyInput = props => {
  return (
    <>
      <TextInput
        textContentType={props.type}
        placeholder={props.placeholder}
        placeholderTextColor={colors.muted}
        selectionColor={colors.ffa_blue_dark}
        autoCompleteType={props.autoCompleteType}
        style={[
          styleSheet.text,
          styleSheet.backWhite,
          props.style,
          styles.input,
          {
            marginBottom: props.touched && props.error ? 5 : 0,
          },
        ]}
        value={props.value}
        onChangeText={t => props.onChange(t)}
        onEndEditing={props.onBlur}
        keyboardType={props.keyboardType}
        multiline={false}
        maxLength={props.maxLength}
        onSubmitEditing={props.onSubmitEditing}
      />

      {props.touched && props.error && (
        <Text style={styleSheet.textError}>{props.error}</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.muted,
    padding: 5,
    fontSize: 14,
    paddingTop: Platform.OS === 'windows' ? 8 : 5,
    borderRadius: Platform.OS === 'ios' ? 50 : 3,
    height: Platform.OS === 'windows' ? 39 : 41,
    marginHorizontal: 5,
  },
});

export default MyInput;

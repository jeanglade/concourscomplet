import React, {useState} from 'react';
import {View, StyleSheet, Platform, Text} from 'react-native';
import PropTypes from 'prop-types';
import DateTimePicker from '@react-native-community/datetimepicker';
import {colors} from '_config';
import moment from 'moment';
import {Button} from '_components';

const maxHeightField = 55;

/**
 * Dropdown
 * @param {string} name
 * @param {string} type
 * @param {string} error
 * @param {boolean} touched
 */
const MyDateTimePicker = ({name, type, error, onChange, touched, ...props}) => {
  const [dateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const setDateFormat = date => {
    return moment(date, moment.ISO_8601).format('DD/MM/YYYY');
  };

  return (
    <>
      <View style={styles.view}>
        {Platform.OS === 'android' ? (
          <Button
            styleView={{padding: 15}}
            onPress={() => setDateTimePickerVisible(true)}
            content={
              <>
                <Text
                  style={{
                    color:
                      setDateFormat(props.value).toString() !==
                      setDateFormat(new Date()).toString()
                        ? colors.black
                        : colors.muted,
                  }}>
                  {setDateFormat(props.value)}
                </Text>
                {dateTimePickerVisible && (
                  <DateTimePicker
                    value={props.value}
                    maximumDate={new Date()}
                    mode="date"
                    onChange={(event, date) => {
                      console.log('event', event);
                      console.log('date', date);
                      setDateTimePickerVisible(false);
                      if (date != undefined) {
                        props.setValues({
                          ...props.values,
                          ['birthDate']: date,
                        });
                      }
                    }}
                  />
                )}
              </>
            }
          />
        ) : (
          <DateTimePicker
            style={{
              height: maxHeightField,
              width: 280,
            }}
            value={props.value}
            maximumDate={new Date()}
            onChange={(event, date) => {
              setDateTimePickerVisible(false);
              if (date != undefined) {
                props.setValues({
                  ...props.values,
                  ['birthDate']: date,
                });
              }
            }}
          />
        )}
      </View>
      {touched && error && <Text style={styles.textError}>{error}</Text>}
    </>
  );
};

DateTimePicker.displayName = 'DateTimePicker';

DateTimePicker.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  error: PropTypes.string,
  touched: PropTypes.bool,
};

DateTimePicker.defaultProps = {
  type: 'none',
  touched: false,
};

const styles = StyleSheet.create({
  view: {
    color: colors.black,
    borderWidth: 2,
    borderColor: colors.muted,
    marginBottom: 10,
    fontSize: 16,
    borderRadius: Platform.OS === 'ios' ? 50 : 0,
    maxHeight: maxHeightField,
    backgroundColor: Platform.OS === 'windows' ? colors.muted : colors.white,
  },
  dropdown: {
    height: 55,
    alignItems: 'center',
    backgroundColor: Platform.OS === 'windows' ? colors.muted : colors.white,
  },
  dropdownIOS: {},
  dropdownItem: {
    color: Platform.OS === 'windows' ? colors.white : colors.black,
    fontSize: 16,
  },
  textError: {
    marginBottom: 5,
    fontSize: 13,
    color: colors.red,
  },
});

export default MyDateTimePicker;

import React, {useState} from 'react';
import {View, StyleSheet, Platform, Text} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {colors, styleSheet} from '_config';
import moment from 'moment';
import {MyButton} from '_components';

const maxHeightField = 55;

const MyDateTimePicker = props => {
  const [dateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const setDateFormat = date => {
    return moment(date, moment.ISO_8601).format('DD/MM/YYYY');
  };

  return (
    <>
      <View style={styles.view}>
        {Platform.OS === 'android' ? (
          <MyButton
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
                      setDateTimePickerVisible(false);
                      props.onValueChange(date);
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
              props.onValueChange(date);
            }}
          />
        )}
      </View>
      {props.touched && props.error && (
        <Text style={styleSheet.textError}>{props.error}</Text>
      )}
    </>
  );
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
});

export default MyDateTimePicker;

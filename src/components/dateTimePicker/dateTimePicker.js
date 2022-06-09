import moment from 'moment';
import React, {useState} from 'react';
import {View, StyleSheet, Platform, Text} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import {MyButton} from '_components';
import {colors, styleSheet} from '_config';

const maxHeightField = 55;

const MyDateTimePicker = props => {
  const [dateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const convertDateFormat = date => {
    return moment(date, moment.ISO_8601).format('DD/MM/YYYY');
  };

  return (
    <>
      <View style={styles.view}>
        {Platform.OS === 'android' ? (
          <MyButton
            styleView={styles.button}
            onPress={() => setDateTimePickerVisible(true)}
            content={
              <>
                <Text
                  style={[
                    styleSheet.text,
                    {
                      color:
                        convertDateFormat(props.value).toString() !==
                        convertDateFormat(new Date()).toString()
                          ? colors.black
                          : colors.muted,
                    },
                  ]}>
                  {convertDateFormat(props.value)}
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
            style={{width: '100%'}}
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
    borderWidth: 1,
    borderColor: colors.muted,
    color: colors.black,
    borderRadius: Platform.OS === 'ios' ? 50 : 3,
    maxHeight: 55,
    backgroundColor: Platform.OS === 'windows' ? colors.muted : colors.white,
    marginHorizontal: 5,
  },
  button: {padding: 5, paddingVertical: 10},
});

export default MyDateTimePicker;

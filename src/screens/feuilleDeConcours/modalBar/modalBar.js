import React, {useState} from 'react';
import {colors, styleSheet} from '_config';
import {Modal, Button, DataTable} from '_components';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  Image,
} from 'react-native';

import i18n from 'i18next';

const ModalBar = props => {
  const [newBarRise, setNewBarRise] = useState(null);

  const addBarRise = () => {
    if (
      newBarRise !== null &&
      newBarRise !== '' &&
      newBarRise !== undefined &&
      newBarRise.match(/^(0|[1-9][0-9]*)$/)
    ) {
      if (
        (!props.isBarrage && !props.barRises.includes(parseInt(newBarRise))) ||
        props.isBarrage
      ) {
        props.setBarRises(oldBarRises => [
          ...oldBarRises,
          parseInt(newBarRise),
        ]);
      }
    }
    setNewBarRise(null);
  };

  const removeBarRise = value => {
    props.setBarRises(props.barRises.filter(barRise => barRise !== value));
  };

  const getBarRiseTextValue = value => {
    if (value.toString().length === 2) {
      value = '0' + value.toString();
    }
    return value.toString()[0] + 'm' + value.toString().slice(1);
  };

  const Item = ({item, index}) => (
    <>
      <View style={styles.item}>
        <View style={styles.flex2}>
          <Text style={styles.text}>{getBarRiseTextValue(item)}</Text>
        </View>
        <View style={[styles.actions, styles.flex1]}>
          <Button
            styleView={styles.cellButton}
            onPress={() => removeBarRise(item)}
            content={
              <Image
                style={styles.icon}
                source={require('../../icons/delete.png')}
              />
            }
          />
        </View>
      </View>
    </>
  );

  return (
    <Modal
      modalVisible={props.modalVisible}
      setModalVisible={props.setModalVisible}
      buttonStyleView={styles.button}
      minWidth={Platform.OS === 'windows' ? 300 : 0}
      buttonContent={
        <Text style={styles.textButton}>
          {!props.isBarrage
            ? i18n.t('competition:bar_rise')
            : i18n.t('competition:bar_rise_barrage')}
        </Text>
      }
      maxHeight={760}
      contentModal={
        <View
          style={[
            styles.container,
            Platform.OS === 'windows' && {minHeight: 400},
          ]}>
          <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            enabled
            keyboardVerticalOffset={0}>
            <Text style={styleSheet.textTitle}>
              {!props.isBarrage
                ? i18n.t('competition:bar_rise')
                : i18n.t('competition:bar_rise_barrage')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TextInput
                style={[
                  styles.textinput,
                  Platform.OS === 'windows' && styles.textInputSize,
                  {flex: 2},
                ]}
                onChangeText={setNewBarRise}
                value={newBarRise}
                placeholder={
                  !props.isBarrage
                    ? i18n.t('competition:new_bar_rise')
                    : i18n.t('competition:new_bar_rise_barrage')
                }
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                maxLength={3}
              />
              <View style={{flex: 1}}>
                <Button
                  onPress={addBarRise}
                  styleView={styles.button}
                  content={
                    <Text style={[styles.textButton, {textAlign: 'center'}]}>
                      {i18n.t('common:validate')}
                    </Text>
                  }
                />
              </View>
            </View>
            {props.barRises.length > 0 && (
              <View style={[styles.containerCenter]}>
                <DataTable
                  headerTable={[
                    {
                      type: 'text',
                      flex: 2,
                      text: i18n.t('competition:hauteur'),
                    },
                    {type: 'text', flex: 1, text: i18n.t('common:actions')},
                  ]}
                  tableData={
                    !props.isBarrage
                      ? props.barRises.sort((a, b) => a > b)
                      : props.barRises
                  }
                  renderItem={({item, index}) => (
                    <Item item={item} index={index} />
                  )}
                />
              </View>
            )}
          </KeyboardAvoidingView>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    color: colors.ffa_blue_light,
    margin: 15,
  },
  button: {
    backgroundColor: colors.ffa_blue_light,
    padding: 10,
    paddingVertical: 13,
    margin: 5,
    borderRadius: 3,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: colors.gray_light,
    margin: 1,
    paddingLeft: 10,
    alignItems: 'center',
    borderRadius: 3,
  },
  container: {
    minWidth: Platform.OS === 'windows' ? 300 : '50%',
    paddingVertical: 20,
  },
  content: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  icon: {
    width: 10,
    height: 10,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerCenter: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    flex: 1,
  },
  textinput: {
    fontSize: 16,
    padding: 10,
    paddingVertical: 9,
    width: 130,
    color: colors.black,
    backgroundColor: colors.white,
    borderColor: colors.muted,
    borderWidth: 1,
  },
  textButton: {
    color: colors.white,
    fontSize: 16,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.black,
  },
  cellButton: {
    backgroundColor: colors.ffa_blue_light,
    padding: 5,
    margin: 5,
    marginStart: 0,
    borderRadius: 3,
    backgroundColor: colors.red,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  textInputSize: {height: 48},
});

export default ModalBar;

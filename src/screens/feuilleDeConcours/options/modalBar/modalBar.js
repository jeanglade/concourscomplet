import React, {useState} from 'react';
import {colors, styleSheet} from '_config';
import {MyModal, MyButton, MyDataTable, MyInput, MyCheckBox} from '_components';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import {setFile} from '../../../../utils/myAsyncStorage';
import i18n from 'i18next';
import {
  getHauteurToTextValue,
  getMonteeDeBarre,
  setConcoursStatus,
} from '../../../../utils/convertor';

const ModalBar = props => {
  const [modalVisible, setModalVisible] = useState(false);

  // If barres changed or not (to avoid unless saves)
  const [hasChanged, setHasChanged] = useState(false);

  // Input state
  const [newBarRise, setNewBarRise] = useState(null);
  // Checkbox state
  const [isBarrage, setIsBarrage] = useState(false);

  //Montée de barre classiques
  const [barRises, setBarRises] = useState(
    getMonteeDeBarre(props.concoursData, true, false),
  );
  //Montée de barrers de barrage
  const [barRisesBarrage, setBarRisesBarrage] = useState(
    getMonteeDeBarre(props.concoursData, false, true),
  );

  //Si les montées de barre ont changé - sauvegarde
  const saveMonteeDeBarre = async () => {
    var data = props.concoursData;
    var resultBars = {
      $id: data.EpreuveConcoursComplet.hasOwnProperty('MonteesBarre')
        ? data.EpreuveConcoursComplet.MonteesBarre.$id
        : '1',
    };
    barRises.forEach((bar, index) => {
      const i = index + 1;
      resultBars['Barre' + (i < 10 ? '0' : '') + i.toString()] = bar;
    });
    barRisesBarrage.forEach((bar, index) => {
      const i = index + barRises.length + 1;
      resultBars['Barre' + (i < 10 ? '0' : '') + i.toString()] = bar;
    });
    data.EpreuveConcoursComplet.MonteesBarre = resultBars;
    //Mise à jour du statut du concours
    if (data._?.statut === i18n.t('common:ready')) {
      data = setConcoursStatus(data, i18n.t('common:in_progress'));
    }
    await setFile(data?._?.id.toString(), JSON.stringify(data));
  };

  const addBarRise = () => {
    if (
      newBarRise !== null &&
      newBarRise !== '' &&
      newBarRise !== undefined &&
      newBarRise.match(/^(0|[1-9][0-9]*)$/)
    ) {
      if (isBarrage) {
        setBarRisesBarrage(oldBarRisesB => [
          ...oldBarRisesB,
          parseInt(newBarRise),
        ]);
      } else {
        if (!barRises.includes(parseInt(newBarRise))) {
          setBarRises(oldBarRises =>
            [...oldBarRises, parseInt(newBarRise)].sort((a, b) =>
              a > b ? 1 : -1,
            ),
          );
        }
      }
      setHasChanged(true);
    }
    setNewBarRise('');
  };

  const removeBarRise = index => {
    if (index >= barRises?.length) {
      setBarRisesBarrage(oldBar =>
        oldBar.filter((_, i) => i !== index - barRises.length),
      );
    } else {
      setBarRises(oldBar => oldBar.filter((_, i) => i !== index));
    }
    setHasChanged(true);
  };

  const Item = ({item, index}) => (
    <>
      <View style={styles.item}>
        <View style={styleSheet.flex2}>
          <Text
            style={[
              styleSheet.text,
              index >= barRises?.length && {color: colors.ffa_blue_light},
            ]}>
            {getHauteurToTextValue(item)}
          </Text>
        </View>
        <View style={[styleSheet.flexRow, styleSheet.flex1]}>
          <MyButton
            styleView={[styleSheet.buttonDelete, styleSheet.backRed]}
            onPress={() => removeBarRise(index)}
            content={
              <Image
                style={styleSheet.icon10}
                source={require('../../icons/delete.png')}
              />
            }
          />
        </View>
      </View>
    </>
  );

  return (
    <MyModal
      modalVisible={modalVisible}
      setModalVisible={bool => {
        if (!bool && hasChanged) {
          setHasChanged(false);
          saveMonteeDeBarre();
          props.refreshConcoursData();
        }
        setModalVisible(bool);
      }}
      buttonStyleView={styleSheet.icon}
      buttonTooltip={i18n.t('competition:bar_rise')}
      minWidth={Platform.OS === 'windows' ? 300 : 0}
      buttonContent={
        <Image
          style={styleSheet.icon20}
          source={require('../../icons/bar_rise.png')}
        />
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
            <Text
              style={[styleSheet.textTitle, {marginStart: 5, marginBottom: 0}]}>
              {i18n.t('competition:bar_rise')}
            </Text>
            {barRises?.length > 0 && (
              <View style={[styles.containerCenter]}>
                <MyDataTable
                  headerTable={[
                    {
                      type: 'text',
                      flex: 2,
                      text: i18n.t('competition:hauteur'),
                    },
                    {type: 'text', flex: 1, text: i18n.t('common:actions')},
                  ]}
                  tableData={[...barRises, ...barRisesBarrage]}
                  renderItem={({item, index}) => (
                    <Item item={item} index={index} />
                  )}
                />
              </View>
            )}
            <View style={[styleSheet.flexRow, {marginTop: 20}]}>
              <MyInput
                style={{width: 150}}
                onChange={value => setNewBarRise(value)}
                value={newBarRise}
                placeholder={i18n.t('competition:new_bar_rise_barrage')}
                keyboardType="numeric"
                maxLength={3}
                onSubmitEditing={addBarRise}
              />
              <View>
                <MyButton
                  onPress={addBarRise}
                  styleView={styleSheet.button}
                  content={
                    <Text style={[styleSheet.text, styleSheet.textWhite]}>
                      {i18n.t('common:validate')}
                    </Text>
                  }
                />
              </View>
            </View>
            {barRises?.length > 0 && (
              <View
                style={[
                  styleSheet.flexRow,
                  {alignItems: 'center', marginStart: 5},
                ]}>
                <MyCheckBox isChecked={isBarrage} setIsChecked={setIsBarrage} />
                <MyButton
                  onPress={() => setIsBarrage(oldValue => !oldValue)}
                  content={
                    <Text
                      style={[styleSheet.text, {color: colors.ffa_blue_light}]}>
                      {i18n.t('competition:bar_rise_barrage')}
                    </Text>
                  }
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
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray_light,
    paddingLeft: 10,
    paddingVertical: 2,
    margin: 1,
    borderRadius: 3,
  },
  container: {
    minWidth: 250,
  },
  containerCenter: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    flex: 1,
  },
});

export default ModalBar;

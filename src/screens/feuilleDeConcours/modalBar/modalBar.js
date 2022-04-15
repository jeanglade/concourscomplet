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
import {setFile} from '../../../utils/myAsyncStorage';
import i18n from 'i18next';

const ModalBar = props => {
  // Input state
  const [newBarRise, setNewBarRise] = useState(null);
  // Checkbox state
  const [isBarrage, setIsBarrage] = useState(false);
  // If barres changed or not (to avoid unless saves)
  const [hasChanged, setHasChanged] = useState(false);

  const getMonteeDeBarre = (isListBarrage = false) => {
    var res = [];
    var isBarBarrage = false;
    var lastBar = null;
    if (
      props.concoursData.EpreuveConcoursComplet.hasOwnProperty('MonteesBarre')
    ) {
      for (var i = 1; i < 20; i++) {
        const nameBarre = 'Barre' + (i < 10 ? '0' : '') + i.toString();
        //Si barre existe
        if (
          props.concoursData.EpreuveConcoursComplet.MonteesBarre.hasOwnProperty(
            nameBarre,
          )
        ) {
          const newBar =
            props.concoursData.EpreuveConcoursComplet.MonteesBarre[nameBarre];
          //Les barres de barrage sont à partir d une baisse de hauteur
          if (lastBar !== null && !isBarBarrage) {
            isBarBarrage = lastBar > newBar;
          }
          //Si (chargement barres normales ET newBar PAS barrage) OU (chargement barres barrages ET newBar EST barrage)
          if (
            (!isListBarrage && !isBarBarrage) ||
            (isListBarrage && isBarBarrage)
          ) {
            res.push(newBar);
          }
          lastBar = newBar;
        }
      }
    }
    return res;
  };

  //Montée de barre classiques
  const [barRises, setBarRises] = useState(getMonteeDeBarre());
  //Montée de barrers de barrage
  const [barRisesBarrage, setBarRisesBarrage] = useState(
    getMonteeDeBarre(true),
  );

  //Si les montées de barre ont changé - sauvegarde
  const saveMonteeDeBarre = async () => {
    if (hasChanged) {
      var res = {
        $id: props.concoursData.EpreuveConcoursComplet.hasOwnProperty(
          'MonteesBarre',
        )
          ? props.concoursData.EpreuveConcoursComplet.MonteesBarre.$id
          : '1',
      };
      barRises.forEach((bar, index) => {
        const i = index + 1;
        res['Barre' + (i < 10 ? '0' : '') + i.toString()] = bar;
      });
      barRisesBarrage.forEach((bar, index) => {
        const i = index + barRises.length + 1;
        res['Barre' + (i < 10 ? '0' : '') + i.toString()] = bar;
      });
      props.concoursData.EpreuveConcoursComplet.MonteesBarre = res;
      await setFile(
        props.concoursId.toString(),
        JSON.stringify(props.concoursData),
      );
    }
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

  const getBarRiseTextValue = value => {
    if (value.toString().length === 2) {
      value = '0' + value.toString();
    }
    return value.toString()[0] + 'm' + value.toString().slice(1);
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
            {getBarRiseTextValue(item)}
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
      modalVisible={props.modalVisible}
      setModalVisible={bool => {
        if (!bool) {
          saveMonteeDeBarre();
          setHasChanged(false);
        }
        props.setModalVisible(bool);
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
                onChange={setNewBarRise}
                value={newBarRise}
                placeholder={i18n.t('competition:new_bar_rise_barrage')}
                keyboardType="numeric"
                maxLength={3}
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
                <Text style={[styleSheet.text, {color: colors.ffa_blue_light}]}>
                  {i18n.t('competition:bar_rise_barrage')}
                </Text>
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

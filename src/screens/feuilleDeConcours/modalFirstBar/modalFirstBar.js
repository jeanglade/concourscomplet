import React, {useState} from 'react';
import {colors, styleSheet} from '_config';
import {MyModal, MyDropdown, MyDataTable} from '_components';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import i18n from 'i18next';
import {getBarRiseTextValue} from '../../../utils/convertor';
import {setFile} from '../../../utils/myAsyncStorage';

const ModalFirstBar = props => {
  // If barres changed or not (to avoid unless saves)
  const [hasChanged, setHasChanged] = useState(false);

  const getMonteeDeBarre = () => {
    var res = [];
    if (
      props.concoursData.EpreuveConcoursComplet.hasOwnProperty('MonteesBarre')
    ) {
      for (var i = 1; i < 20; i++) {
        const nameBarre = 'Barre' + (i < 10 ? '0' : '') + i.toString();
        if (
          props.concoursData.EpreuveConcoursComplet.MonteesBarre.hasOwnProperty(
            nameBarre,
          )
        ) {
          res.push(
            props.concoursData.EpreuveConcoursComplet.MonteesBarre[nameBarre],
          );
        }
      }
    }
    return res;
  };

  //Montée de barre classiques
  const [barRises] = useState(getMonteeDeBarre());

  //Si les premières barre ont changé - sauvegarde
  const saveFirstBar = async () => {
    if (hasChanged) {
      setHasChanged(false);
      await setFile(
        props.concoursData?._?.id.toString(),
        JSON.stringify(props.concoursData),
      );
    }
  };

  const Item = ({item, index}) => (
    <>
      <View style={styles.item}>
        <View style={styleSheet.flex2}>
          <Text style={[styleSheet.text]}>
            {item.Athlete?.Prenom} {item.Athlete?.Nom}
          </Text>
        </View>
        <View style={{width: 130}}>
          <MyDropdown
            styleContainer={{}}
            stylePickerIOS={{width: 200}}
            onValueChange={value => {
              setHasChanged(true);
              item.Athlete.firstBar = parseInt(value.toString());
            }}
            data={barRises.map(v => ({
              label: getBarRiseTextValue(v),
              value: v,
            }))}
            selectedValue={item.Athlete?.firstBar}
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
          saveFirstBar();
          setHasChanged(false);
        }
        props.setModalVisible(bool);
      }}
      buttonStyleView={styleSheet.icon}
      buttonTooltip={i18n.t('competition:first_bar_rise')}
      minWidth={Platform.OS === 'windows' ? 300 : 0}
      buttonContent={
        <Image
          style={styleSheet.icon20}
          source={require('../../icons/first_bar_rise.png')}
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
              {i18n.t('competition:first_bar_rise')}
            </Text>
            <View style={[styles.containerCenter]}>
              <MyDataTable
                headerTable={[
                  {
                    type: 'text',
                    flex: 2,
                    text: '',
                  },
                  {type: 'text', flex: 1, text: ''},
                ]}
                tableData={
                  props.concoursData?.EpreuveConcoursComplet
                    ?.TourConcoursComplet?.LstSerieConcoursComplet[0]
                    ?.LstResultats
                }
                renderItem={({item, index}) => (
                  <Item item={item} index={index} />
                )}
              />
            </View>
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
    minWidth: 300,
  },
  containerCenter: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    flex: 1,
  },
});

export default ModalFirstBar;

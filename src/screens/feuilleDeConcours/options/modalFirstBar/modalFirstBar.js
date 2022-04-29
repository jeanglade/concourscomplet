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
import {
  getHauteurToTextValue,
  getMonteeDeBarre,
  setConcoursStatus,
} from '../../../../utils/convertor';
import {setFile} from '../../../../utils/myAsyncStorage';

const ModalFirstBar = props => {
  const [modalVisible, setModalVisible] = useState(false);

  // If barres changed or not (to avoid unless saves)
  const [hasChanged, setHasChanged] = useState(false);

  //Montée de barre
  const [barRises] = useState(getMonteeDeBarre(props.concoursData));

  //Sauvegarde
  const saveFirstBar = async () => {
    var data = props.concoursData;
    //Mise à jour du statut du concours
    if (data._?.statut === i18n.t('common:ready')) {
      data = setConcoursStatus(data, i18n.t('common:in_progress'));
    }
    await setFile(data._?.id.toString(), JSON.stringify(data));
  };

  //Template de la ligne du tableau
  const Item = ({item, index}) => {
    const [firstB, setFirstB] = useState(parseInt(item.Athlete?.firstBar));
    const [poteaux, setPoteaux] = useState(
      item.Athlete?.poteaux !== undefined ? item.Athlete.poteaux : '0',
    );
    return (
      <>
        <View style={styles.item}>
          <View style={styleSheet.flex1}>
            {/* Athlète */}
            <Text style={[styleSheet.text]}>
              {item.Athlete?.Prenom} {item.Athlete?.Nom}
            </Text>
          </View>
          {/* Liste des montees de barres */}
          <View style={{width: 130}}>
            <MyDropdown
              styleContainer={{}}
              stylePickerIOS={{width: 200}}
              onValueChange={value => {
                setHasChanged(true);
                item.Athlete.firstBar = value;
                setFirstB(parseInt(value.toString()));
              }}
              data={barRises.map(v => ({
                label: getHauteurToTextValue(v),
                value: v,
              }))}
              selectedValue={firstB}
            />
          </View>
          {props.concoursData?._?.epreuve.includes('Perche') && (
            <View style={{width: Platform.OS === 'windows' ? 80 : 100}}>
              <MyDropdown
                styleContainer={{}}
                stylePickerIOS={{width: 200}}
                onValueChange={value => {
                  setPoteaux(value);
                  props.concoursData.EpreuveConcoursComplet.TourConcoursComplet.LstSerieConcoursComplet[0].LstResultats[
                    index
                  ].Athlete.poteaux = value;
                }}
                data={['0', '10', '20', '30', '40', '50', '60', '70', '80'].map(
                  v => ({
                    label: v,
                    value: v,
                  }),
                )}
                selectedValue={poteaux}
              />
            </View>
          )}
        </View>
      </>
    );
  };

  return (
    <MyModal
      modalVisible={modalVisible}
      setModalVisible={bool => {
        if (!bool && hasChanged) {
          setHasChanged(false);
          saveFirstBar();
          props.refreshConcoursData();
        }
        setModalVisible(bool);
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
                    flex: 1,
                    text: '',
                  },
                  {
                    type: 'text',
                    width: 130,
                    text: props.concoursData?._?.epreuve.includes('Perche')
                      ? i18n.t('competition:first_bar_rise')
                      : '',
                  },
                ].concat(
                  props.concoursData?._?.epreuve.includes('Perche')
                    ? [
                        {
                          type: 'text',
                          width: Platform.OS === 'windows' ? 65 : 100,
                          text: i18n.t('competition:poteaux'),
                        },
                      ]
                    : [],
                )}
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

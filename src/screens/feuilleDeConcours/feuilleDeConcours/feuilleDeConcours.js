import React, {useState} from 'react';
import {Text, View, Image} from 'react-native';
import i18n from 'i18next';
import {
  ModalAddAthlete,
  TableConcoursSB,
  TableConcoursSL,
  TableConcoursLR,
  ModalParam,
  InfoConcours,
  ModalBar,
  ModalFirstBar,
  ModalAthletePerAthlete,
  Title,
} from '_screens';
import {styleSheet} from '_config';
import {getFile} from '../../../utils/myAsyncStorage';

const FeuilleDeConcours = props => {
  //Initialisation des données du concours
  const concoursItem = props.route.params.item;
  const [concoursData, setConcoursData] = useState(JSON.parse(concoursItem));

  //Initialisation des variables Option Add an athlete
  const [modalAddAthlete, setModalAddAthlete] = useState(false);
  const initFormAddAthlete = {
    categories: concoursData.LstCategoriesAthlete,
    type: 'new',
    firstname: '',
    name: '',
    sex: i18n.t('competition:sex') + '*',
    birthDate: new Date(),
    licence_number: '',
    club: '',
    category: i18n.t('competition:category'),
    dossard: '',
  };
  const [fieldsAddAthtlete, setFieldsAddAthtlete] =
    useState(initFormAddAthlete);

  //Initalisatoin des variables Options Paramètres
  const [modalParam, setModalParam] = useState(false);

  //Initalisatoin des variables Options Montées de barre
  const [modalBar, setModalBar] = useState(false);
  const [modalFirstBar, setModalFirstBar] = useState(false);
  const [modalAthletePerAthlete, setModalAthletePerAthlete] = useState(false);

  const refreshConcoursData = async () => {
    const id = concoursData?._?.id;
    const value = await getFile(id);
    setConcoursData(JSON.parse(value));
  };

  props.navigation.setOptions({
    header: ({}) => {
      return (
        <Title
          concoursData={concoursData}
          navigation={props.navigation}
          refreshAndGoBack={props.route.params.refreshAndGoBack}
        />
      );
    },
  });

  return (
    <View
      style={[
        styleSheet.backWhite,
        styleSheet.flex1,
        {padding: 10, paddingHorizontal: 20},
      ]}>
      <View
        style={[
          styleSheet.flexRowCenter,
          styleSheet.flexWrap,
          {justifyContent: 'space-between'},
        ]}>
        <View style={[styleSheet.flexRowCenter, styleSheet.flexWrap]}>
          {concoursData?._?.type === 'SB' && (
            <>
              <ModalBar
                setModalVisible={setModalBar}
                modalVisible={modalBar}
                concoursData={concoursData}
              />
              <ModalFirstBar
                setModalVisible={setModalFirstBar}
                modalVisible={modalFirstBar}
                concoursData={concoursData}
              />
            </>
          )}
          <InfoConcours concoursData={concoursData} />
        </View>
        <View style={styleSheet.flexRowCenter}>
          <ModalAthletePerAthlete
            setModalVisible={setModalAthletePerAthlete}
            modalVisible={modalAthletePerAthlete}
          />
          <ModalAddAthlete
            modalVisible={modalAddAthlete}
            setModalVisible={b => {
              setFieldsAddAthtlete(initFormAddAthlete);
              setModalAddAthlete(b);
            }}
            fieldsAddAthtlete={fieldsAddAthtlete}
            setFieldsAddAthtlete={setFieldsAddAthtlete}
            concoursData={concoursData}
          />
          <ModalParam
            setModalVisible={setModalParam}
            modalVisible={modalParam}
            concoursData={concoursData}
            setConcoursData={setConcoursData}
            refreshConcoursData={refreshConcoursData}
          />
        </View>
      </View>
      {concoursData?._?.type === 'SB' && (
        <TableConcoursSB
          concoursData={concoursData}
          setModalAddAthlete={setModalAddAthlete}
          setFieldsAddAthtlete={setFieldsAddAthtlete}
          fieldsAddAthtlete={fieldsAddAthtlete}
        />
      )}
      {concoursData?._?.type === 'SL' && (
        <TableConcoursSB
          concoursData={concoursData}
          setModalAddAthlete={setModalAddAthlete}
          setFieldsAddAthtlete={setFieldsAddAthtlete}
          fieldsAddAthtlete={fieldsAddAthtlete}
        />
      )}
      {concoursData?._?.type === 'LT' && (
        <TableConcoursSB
          concoursData={concoursData}
          setModalAddAthlete={setModalAddAthlete}
          setFieldsAddAthtlete={setFieldsAddAthtlete}
          fieldsAddAthtlete={fieldsAddAthtlete}
        />
      )}
    </View>
  );
};

export default FeuilleDeConcours;

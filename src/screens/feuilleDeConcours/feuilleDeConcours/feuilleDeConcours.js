import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import i18n from 'i18next';

import {
  ModalAddAthlete,
  TableConcoursSB,
  TableConcoursSL,
  TableConcoursLR,
  ModalParam,
} from '_screens';
import {colors} from '_config';

const FeuilleDeConcours = props => {
  //Initialisation des données du concours
  const dataConcours = props.route.params.item;
  const competitionData = JSON.parse(dataConcours.data);
  const listAthlete =
    competitionData.EpreuveConcoursComplet.TourConcoursComplet
      .LstSerieConcoursComplet[0].LstResultats;
  const [tableData, setTableData] = useState(listAthlete);

  //Initialisation des variables Option Add an athlete
  const [modalAddAthlete, setModalAddAthlete] = useState(false);
  const initFormAddAthlete = {
    categories: competitionData.LstCategoriesAthlete,
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

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-bewteen',
          alignItems: 'center',
        }}>
        <Text style={styles.titleText}>
          {dataConcours.epreuve} - {dataConcours.dateInfo}
        </Text>
        <View>
          <ModalParam
            setModalVisible={setModalParam}
            modalVisible={modalParam}
          />
        </View>
      </View>
      {competitionData.EpreuveConcoursComplet.CodeFamilleEpreuve === 'SB' && (
        <TableConcoursSB
          dataConcours={dataConcours}
          tableData={tableData}
          setTableData={setTableData}
          compData={competitionData}
          setModalAddAthlete={setModalAddAthlete}
          setFieldsAddAthtlete={setFieldsAddAthtlete}
          fieldsAddAthtlete={fieldsAddAthtlete}
        />
      )}
      {competitionData.EpreuveConcoursComplet.CodeFamilleEpreuve === 'SL' && (
        <TableConcoursSL
          dataConcours={dataConcours}
          tableData={tableData}
          setTableData={setTableData}
          compData={competitionData}
          setModalAddAthlete={setModalAddAthlete}
          setFieldsAddAthtlete={setFieldsAddAthtlete}
          fieldsAddAthtlete={fieldsAddAthtlete}
        />
      )}
      {competitionData.EpreuveConcoursComplet.CodeFamilleEpreuve === 'LR' && (
        <TableConcoursLR
          dataConcours={dataConcours}
          tableData={tableData}
          setTableData={setTableData}
          compData={competitionData}
          setModalAddAthlete={setModalAddAthlete}
          setFieldsAddAthtlete={setFieldsAddAthtlete}
          fieldsAddAthtlete={fieldsAddAthtlete}
        />
      )}
      <View style={styles.rowOptions}>
        <Text style={styles.titleText}>{i18n.t('common:options')} : </Text>
        <ModalAddAthlete
          setAthletesData={setTableData}
          modalVisible={modalAddAthlete}
          setModalVisible={b => {
            setFieldsAddAthtlete(initFormAddAthlete);
            setModalAddAthlete(b);
          }}
          athletesData={tableData}
          fieldsAddAthtlete={fieldsAddAthtlete}
          setFieldsAddAthtlete={setFieldsAddAthtlete}
          fileContent={competitionData}
          fileName={dataConcours.id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 10,
  },
  titleText: {
    fontSize: 20,
    color: colors.ffa_blue_light,
    marginLeft: 15,
    marginVertical: 5,
  },
  rowOptions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 20,
  },
});

export default FeuilleDeConcours;

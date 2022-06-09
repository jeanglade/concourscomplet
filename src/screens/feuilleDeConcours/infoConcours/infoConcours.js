import React from 'react';
import {styleSheet} from '_config';
import {View, Text} from 'react-native';
import i18n from 'i18next';
import {convertHauteurToString} from '../../../utils/convertor';
import MyButton from '../../../components/button/button';

const InfoConcours = props => {
  return (
    <View style={[styleSheet.flexRowCenter, styleSheet.flexWrap]}>
      <Text style={[styleSheet.text, {marginHorizontal: 5}]}>
        {props.concoursData?._?.nbAthlete}{' '}
        {i18n.t('competition:athletes').toLocaleLowerCase()}
      </Text>
      {props.concoursData?._?.type !== 'SB' && (
        <Text style={[styleSheet.text, {marginHorizontal: 5}]}>
          {props.concoursData?._?.nbTries} {i18n.t('competition:tries')}
        </Text>
      )}
      {props.concoursData?.EpreuveConcoursComplet?.TourConcoursComplet
        ?.NumTour != 7 && (
        <>
          <MyButton
            onPress={null}
            style={{}}
            tooltip={i18n.t('competition:nb_athlete_qualif')}
            content={
              <Text style={[styleSheet.text, {marginHorizontal: 5}]}>
                {i18n.t('competition:short_nb_athlete_qualif')}{' '}
                {props.concoursData?.EpreuveConcoursComplet?.TourConcoursComplet?.NbQualifiePlace?.toString()}
              </Text>
            }
          />

          {!props.concoursData?.EpreuveConcoursComplet?.TourConcoursComplet
            ?.StandardQualificationPlace && (
            <MyButton
              onPress={null}
              style={{}}
              tooltip={i18n.t('competition:perf_minima')}
              content={
                <Text style={[styleSheet.text, {marginHorizontal: 5}]}>
                  {i18n.t('competition:short_perf_minima')}{' '}
                  {convertHauteurToString(
                    props.concoursData?.EpreuveConcoursComplet?.TourConcoursComplet?.PerfMinima?.toString(),
                  )}
                </Text>
              }
            />
          )}
        </>
      )}
    </View>
  );
};

export default InfoConcours;

import {colors} from '_config';
import i18n from 'i18next';
import moment from 'moment';

export const setDateFormat = date => {
  return moment(date, moment.ISO_8601).format('DD/MM/YYYY');
};

export const getHauteurToTextValue = value => {
  var res = value;
  if (res !== undefined && res !== null) {
    if (parseInt(value) || value === '0') {
      if (value.toString().length === 1) {
        value = '00' + value.toString();
      }
      if (value.toString().length === 2) {
        value = '0' + value.toString();
      }
      res = value.toString().slice(0, -2) + 'm' + value.toString().slice(-2);
    }
  }
  return res;
};

export const getStatusColor = statut => {
  var res = colors.black;
  switch (statut) {
    case i18n.t('common:ready'):
      res = colors.black;
      break;
    case i18n.t('common:in_progress'):
      res = colors.red;
      break;
    case i18n.t('common:finished'):
      res = colors.orange;
      break;
    case i18n.t('common:send_to_elogica'):
      res = colors.green;
      break;
  }
  return res;
};

export const setConcoursStatus = (
  concoursData,
  newStatus = i18n.t('common:in_progress'),
) => {
  concoursData._.statut = newStatus;
  concoursData._.statutColor = getStatusColor(newStatus);
  return concoursData;
};

export const getImageEpreuve = epreuve => {
  var res = '';
  switch (true) {
    case epreuve.includes('Hauteur'):
      res = 'SautEnHauteur_Dark';
      break;
    case epreuve.includes('Perche'):
      res = 'SautALaPerche_Dark';
      break;
    case epreuve.includes('Longueur'):
      res = 'SautEnLongueur_Dark';
      break;
    case epreuve.includes('Triple saut'):
      res = 'SautEnLongueur_Dark';
      break;
    case epreuve.includes('Poids'):
      res = 'LancerDePoids_Dark';
      break;
    case epreuve.includes('Javelot'):
      res = 'Javelot_Dark';
      break;
    case epreuve.includes('Marteau'):
      res = 'LancerDeMarteau_Dark';
      break;
    case epreuve.includes('Disque'):
      res = 'LancerDeDisque_Dark';
      break;
  }
  return res;
};

export const getMonteeDeBarre = (
  concoursData,
  onlyClassicBar = false,
  onlyBarrageBar = false,
) => {
  var resultBar = [];
  var isBarBarrage = false;
  var tempLastBar = null;
  var concours =
    concoursData.EpreuveConcoursComplet.TourConcoursComplet
      .LstSerieConcoursComplet[0];
  //Si le concours a des barres (SB)
  if (
    concoursData?._?.type === 'SB' &&
    concours.hasOwnProperty('LstMonteesBarre')
  ) {
    for (var i = 1; i < Object.keys(concours.LstMonteesBarre).length; i++) {
      const newBar = concours.LstMonteesBarre[i].Valeur;
      //Les barres de barrage sont à partir d une baisse de hauteur
      if (tempLastBar !== null && !isBarBarrage) {
        isBarBarrage = tempLastBar > newBar;
      }
      //Si (chargement barres normales ET newBar PAS barrage) OU
      // (chargement barres barrages ET newBar EST barrage) OU
      // (chargement de toutes les barres)
      if (
        (onlyClassicBar && !isBarBarrage) ||
        (onlyBarrageBar && isBarBarrage) ||
        (!onlyClassicBar && !onlyBarrageBar)
      ) {
        resultBar.push(newBar);
      }
      tempLastBar = newBar;
    }
  }
  return resultBar;
};

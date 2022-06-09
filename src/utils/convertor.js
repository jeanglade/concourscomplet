import {colors} from '_config';
import i18n from 'i18next';
import moment from 'moment';

export const convertDateFormat = date => {
  return moment(date, moment.ISO_8601).format('DD/MM/YYYY');
};

export const convertHauteurToString = value => {
  var res = value?.toString()?.replace('m', '');
  if (parseInt(res) || res === '0') {
    const length = res.toString().length;
    res = (length === 1 ? '00' : length === 2 ? '0' : '') + res.toString();
    res = res.toString().slice(0, -2) + 'm' + res.toString().slice(-2);
  }
  console.log('convertHauteurToString', res?.toString());
  return res != undefined ? res.toString() : null;
};

export const convertStringToHauteur = value => {
  return new Number(value?.toString().replace('m', ''));
};

export const convertVentToString = value => {
  var text = parseFloat(value?.toString()?.replace('+', ''));
  return isNaN(text)
    ? null
    : text > 0
    ? '+' + text.toString()
    : text.toString();
};

export const convertStringToVent = value => {
  var vent = parseFloat(value?.toString()?.replace('+', ''));
  return isNaN(vent) ? null : vent;
};

export const convertAthleteStatus = statut => {
  var res = new Number('0');
  switch (statut) {
    case 'DNF':
      res = 99999991;
      break;
    case 'DQ':
      res = 99999992;
      break;
    case 'DNS':
      res = 99999993;
      break;
    case 'NM':
      res = 99999994;
      break;
    case 'NP':
      res = 99999995;
      break;
  }
  return res;
};

export const convertStatusAthlete = statut => {
  var res = new String('');
  switch (statut) {
    case 99999991:
      res = 'DNF';
      break;
    case 99999992:
      res = 'DQ';
      break;
    case 99999993:
      res = 'DNS';
      break;
    case 99999994:
      res = 'NM';
      break;
    case 99999995:
      res = 'NP';
      break;
  }
  return res;
};

export const convertStatusColor = statut => {
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
  concoursData._.statutColor = convertStatusColor(newStatus);
  return concoursData;
};

export const convertEpreuveToImage = epreuve => {
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

export const getAllMonteesDeBarre = (
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
    for (var i = 0; i < concours.LstMonteesBarre.length; i++) {
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

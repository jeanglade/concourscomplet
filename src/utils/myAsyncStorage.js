import AsyncStorage from '@react-native-async-storage/async-storage';
import {Keyboard} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import i18n from 'i18next';

export const getAllKeys = async () => {
  try {
    //await AsyncStorage.clear();
    const keys = await AsyncStorage.getAllKeys();
    return keys;
  } catch (e) {
    console.error(e);
  }
};

export const clear = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.error(e);
  }
};

export const getFile = async key => {
  try {
    const item = await AsyncStorage.getItem(key);
    return item;
  } catch (e) {
    console.error(e);
  }
};

export const getFiles = async keys => {
  try {
    const items = await AsyncStorage.multiGet(keys);
    return items;
  } catch (e) {
    console.error(e);
  }
};

export const setFile = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error(e);
  }
};

export const removeFile = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error(e);
  }
};

export const removeFiles = async keys => {
  try {
    await AsyncStorage.multiRemove(keys);
  } catch (e) {
    console.error(e);
  }
};

export const saveEachSerie = async (content, addOneSerieDataTable) => {
  try {
    const contentObject = JSON.parse(content);
    contentObject?.EpreuveConcoursComplet?.TourConcoursComplet?.LstSerieConcoursComplet?.forEach(
      serie => {
        const newContentObject = JSON.parse(content);
        //Suppression des séries
        newContentObject.EpreuveConcoursComplet.TourConcoursComplet.LstSerieConcoursComplet =
          [];
        //Ajout de la série
        newContentObject?.EpreuveConcoursComplet?.TourConcoursComplet?.LstSerieConcoursComplet?.push(
          serie,
        );
        const codeConcours =
          newContentObject?.EpreuveConcoursComplet?.TourConcoursComplet
            ?.LstSerieConcoursComplet[0]?.CodeConcours + '.json';
        if (codeConcours != '.json') {
          const result = saveJsonFile(
            codeConcours,
            JSON.stringify(newContentObject),
          );
          if (result) {
            addOneSerieDataTable(
              codeConcours,
              JSON.stringify(newContentObject),
            );
          }
        }
      },
    );
  } catch (e) {
    console.error(e);
  }
};

export const saveJsonFile = async (fileName, content) => {
  try {
    var result = false;
    //const contentFile = await getFile(fileName);
    /*if (contentFile != null) {
      showMessage({
        message: i18n.t('toast:file_already_exist'),
        type: 'warning',
      });
    } else {*/
    await setFile(fileName, content);
    result = true;
    showMessage({
      message: i18n.t('toast:uploaded_file'),
      type: 'success',
    });
    //}
    Keyboard.dismiss();
    return result;
  } catch (e) {
    console.error(e);
    Keyboard.dismiss();
    return false;
  }
};

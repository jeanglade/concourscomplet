import DocumentPicker from 'react-native-document-picker';
import ReactNativeBlobUtil from 'react-native-blob-util';
import base64 from 'react-native-base64';
import {Platform} from 'react-native';

import {saveEachSerie} from '../../utils/myAsyncStorage';

export const pickOneDeviceFile = async (
  t,
  showMessage,
  addOneSerieDataTable,
) => {
  try {
    const newFile = await DocumentPicker.pickSingle({
      presentationStyle: 'fullScreen',
      copyTo: 'cachesDirectory',
      readContent: true,
    });
    // READ ONE FILE
    if (newFile !== null) {
      if (newFile.type === 'application/json') {
        switch (Platform.OS) {
          default:
            await ReactNativeBlobUtil.fs
              .readFile(
                Platform.OS === 'android'
                  ? newFile.uri
                  : newFile.fileCopyUri.replace('file:/', ''),
                'utf8',
              )
              .then(content => {
                saveEachSerie(content, t, showMessage, addOneSerieDataTable);
              })
              .catch(e => {
                console.error(e);
                showMessage({
                  message: t('toast:import_error'),
                  type: 'danger',
                });
              });
            break;
          case 'windows':
            saveEachSerie(
              base64.decode(newFile.content),
              t,
              showMessage,
              addOneSerieDataTable,
            );
            break;
        }
      } else {
        showMessage({
          message: t('toast:json_format'),
          type: 'warning',
        });
      }
    }
  } catch (e) {
    showMessage({
      message: t('toast:loading_cancelled'),
      type: 'warning',
    });
    console.error(e);
  }
};

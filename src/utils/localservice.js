import DocumentPicker from 'react-native-document-picker';
import {unzip} from 'react-native-zip-archive';
import base64 from 'react-native-base64';
import ReactNativeBlobUtil from 'react-native-blob-util';

import {saveJsonFile} from '../../utils/webservice';

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
    if (newFile.type == 'application/zip') {
      const newPath =
        Platform.OS === 'android'
          ? '/data/user/0/com.concourscomplet/files'
          : '/';
      unzip(newFile.fileCopyUri.substring(5), newPath)
        .then(path => {
          ReactNativeBlobUtil.fs
            .ls('file:' + path)
            .then(files => {
              files.forEach(file => {
                if (file.match(/.+\.json/g)) {
                  readFile(
                    {
                      type: 'application/json',
                      name: file,
                      uri: '/data/user/0/com.concourscomplet/files/' + file,
                    },
                    t,
                    showMessage,
                    addOneSerieDataTable,
                  );
                }
              });
            })
            .catch(e => console.error(e));
        })
        .catch(e => console.error(e));
    } else {
      // READ ONE FILE
      readFile(newFile, t, showMessage, addOneSerieDataTable);
    }
  } catch (e) {
    showMessage({
      message: t('toast:loading_cancelled'),
      type: 'warning',
    });
    console.error(e);
  }
};

const readFile = async (newFile, t, showMessage, addOneSerieDataTable) => {
  try {
    if (newFile != null) {
      if (newFile.type == 'application/json') {
        console.log(newFile);
        switch (Platform.OS) {
          case 'android':
            await ReactNativeBlobUtil.fs
              .readFile(newFile.uri, 'utf8')
              .then(content => {
                const res = saveJsonFile(newFile.name, content, t, showMessage);
                if (res) addOneSerieDataTable(newFile.name, content);
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
            const res = saveJsonFile(
              newFile.name,
              base64.decode(newFile.content),
              t,
              showMessage,
            );
            if (res)
              addOneSerieDataTable(
                newFile.name,
                base64.decode(newFile.content),
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
    console.error(e);
  }
};

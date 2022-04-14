import base64 from 'react-native-base64';
import {Keyboard} from 'react-native';
import {getFile} from '../../utils/myAsyncStorage';
import {showMessage} from 'react-native-flash-message';
import i18n from 'i18next';

// Récupère le fichier JSON sur le serveur via le webservice
export const validateCompetitionCode = async codeCompetition => {
  const soapRequest = require('easy-soap-request');
  var res = null;
  var XMLParser = require('react-xml-parser');
  if (codeCompetition !== null && codeCompetition !== '') {
    const {response} = await soapRequest({
      url: 'http://webservices.e-logica.fr/WS_ELOG_COMP_DEV/ServiceElogicaDEV.svc',
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        soapAction:
          'http://tempuri.org/IServiceElogicaDEV/GetFileConcoursComplet',
      },
      xml:
        '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">\
            <Body>\
                <GetFileConcoursComplet xmlns="http://tempuri.org/">\
                    <codeFileName>' +
        codeCompetition +
        '</codeFileName>\
                </GetFileConcoursComplet>\
            </Body>\
        </Envelope>',
    }).catch(e => {
      showMessage({
        message: i18n.t('toast:wrong_code'),
        type: 'danger',
      });
      Keyboard.dismiss();
    });

    const {body, statusCode} = response;
    if (statusCode === 200) {
      const xmlResponse = new XMLParser().parseFromString(body);
      res = base64.decode(
        xmlResponse.getElementsByTagName('GetFileConcoursCompletResult')[0]
          .value,
      );
    } else {
      showMessage({
        message: i18n.t('toast:import_error'),
        type: 'danger',
      });
      Keyboard.dismiss();
    }
  } else {
    showMessage({
      message: i18n.t('toast:competition_sheet_empty'),
      type: 'danger',
    });
  }
  return res;
};

// A VALIDER - Envoi un JSON sur le serveur via le webservice
export const sendJson = async fileName => {
  const soapRequest = require('easy-soap-request');
  var result = null;
  const contentFile = await getFile(fileName);
  if (contentFile != null) {
    (async () => {
      const {response} = await soapRequest({
        url: 'http://webservices.e-logica.fr/WS_ELOG_COMP_DEV/ServiceElogicaDEV.svc',
        headers: {
          'Content-Type': 'text/xml;charset=UTF-8',
          soapAction:
            'http://tempuri.org/IServiceElogicaDEV/PushFileConcoursCompletFromTablette',
        },
        xml:
          '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">\
              <Body>\
             <PushFileConcoursCompletFromTablette xmlns="http://tempuri.org/">\
             <json>{"fileName":"' +
          fileName +
          '","fileStream":"' +
          base64.encode(contentFile) +
          '"}</json>\
             </PushFileConcoursCompletFromTablette>\
               </Body>\
      </Envelope>',
      }).catch(e => console.error(e));
      const {statusCode} = response;
      if (statusCode === 200) {
        result = true;
      }
    })();
  }
  return result;
};

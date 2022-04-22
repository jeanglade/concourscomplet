# Concours Complet - FFA

## Procédure de configuration

### Installation des technologies

Technologies nécessaires :

- [Git](https://git-scm.com/downloads)
- [npm](https://nodejs.org/fr/download/)
- [React Native](https://reactnative.dev/docs/0.67/environment-setup)
  - [React Native for Windows](https://microsoft.github.io/react-native-windows/docs/rnw-dependencies)

Développé avec [Visual Studio Code](https://code.visualstudio.com/Download)

### Configuration de l'environnement
#### Installation du code source

```shell
#Clonage du code source
git clone https://github.com/jeanglade/concourscomplet
cd concourscomplet/

#Installation des dépendances
npm install  
#Pour IOS
cd ios && pod install && cd ..  
```
### Lancer le projet

```shell
npm run start
```

```shell
#Android
# Créer le fichier local.properties dans le dossier android/app/ avec sdk.dir=C\:\\Users\\jeana\\AppData\\Local\\Android\\Sdk
npm run android #ou passer par Android Studio
#IOS
npm run ios #ou passer par XCode
#Windows
npm run windows
#Ouverture automatique d une page de debug pour Windows : http://localhost:8081/debugger-ui/
#Debug dans la console de la page
```
## Procédure de développement
### Demande de fusion (Pull Request)

Le dépôt est verrouillé en écriture sur la branche *main*, aussi, pour tout code à ajouter/modifier/supprimer, créez une
branche respectant la convention de nommage ci-dessous à partir de *main* ou d'une autre branche.

Une fois vos modifications effectuées et commitées, vous pouvez *push* sur votre branche. Sur GutHub, créez une requête
de fusion ou *pull request*. Un autre développeur pourra ensuite l'approuver. Une fois approuvée, la requête de fusion
peut être validée et *merge* sur la branche principale.

### Convention de nommage

Afin de pouvoir s'y retrouver aisément dans les différentes branches et commits, nous utilisons les conventions
suivantes.

#### Branches

Les branches créées sont de la forme suivante : `<cadre>/<initiales>/<nom-de-la-branche>`

##### Cadre
Le `cadre` de la branche peut être :
- feature (nouvelle fonctionnalité)
- refacto (modification)
- fix (correction)
- documentation

##### Initiales
Vos `initiales` doivent être en minuscule.

##### Nom de branche
Enfin, le `nom-de-la-branche` correspond à une précision simple de la tâche. Les espaces sont remplacés par `-`.

#### Exemple
Une branche bien nommée ressemble à : "fix/ja/navbar-menu"

#### Messages de commit

Les messages de commit sont également formatés, pour cela, commencez par un [Gitmoji](https://gitmoji.dev)
correspondant au type de modification, puis une simple description :
`:recycle: Add table homepage` deviendra alors "♻ Add table homepage".
Il est préférable de faire les messages de commit en anglais (ou en français).

## Procédure de mise en production
### Compilation en production

```shell
# Prerequis
npm install


# Generate .APK (Android) on Windows Prompt in Administrator mode
## bundleRelease (AAB) et assembleRelease (APK)
cd android && gradlew assembleRelease && cd ./app/build/outputs/apk/release && explorer . && cd ../../../../../../

# Generate App Packages (Windows) on Windows
## Visual Studio > Release & x86 & concourscomplet (UWP) > Run to verify the build
## Projet > Publier > Créer des packages d'application : Chargement indépendant > Certificat à partir d'un fichier > Version & x86 > Créer
## Change in Add-AppDevPackage.ps1 : $NeedDeveloperLicense = true
## To install right click on .ps1 > Execute with PowerShell (if already install, double click on the new .appxbundle file to reinstall)

// Generate .IPA (IOS)

```

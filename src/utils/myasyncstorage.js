import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAllKeys = async () => {
  try {
    //await AsyncStorage.clear();
    const keys = await AsyncStorage.getAllKeys();
    return keys;
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

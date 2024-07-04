import AsyncStorage from '@react-native-async-storage/async-storage';

// Set AsyncStorage with expired time
export const setAsyncStorage = async (key: string, data: any) => {
  try {
    // Convert data to string
    const strData = JSON.stringify(data);
    // Save data to AsyncStorage
    await AsyncStorage.setItem(key, strData);
  } catch (error) {
    console.error('Error setting AsyncStorage:', error);
  }
};

export const getAsyncStorage = async (key: string): Promise<any | null> => {
  try {
    // Retrieve data from AsyncStorage
    const result = await AsyncStorage.getItem(key);
    if (result !== null) {
      // Parse the data
      return JSON.parse(result);
    } else {
      return null; // Return null if no data found
    }
  } catch (error) {
    console.error('Error getting AsyncStorage:', error);
    return null; // Return null if error occurs
  }
};

// delete AsyncStorage Data
export const deleteAsyncStorage = async (key: string): Promise<void> => {
  try {
    // Remove data from AsyncStorage
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error deleting AsyncStorage:', error);
  }
};

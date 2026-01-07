import * as SecureStore from 'expo-secure-store';

export async function retrieveParsedDataFromSecureStore<T>(key: string): Promise<T> {
  if (!key) {
    throw new Error('Key must be provided');
  }
  try {
    //get the key from the secure store
    const data = await SecureStore.getItemAsync(key);
    if (!data) {
      throw new Error(`No data found for key: ${key}`);
    }
    try {
      return JSON.parse(data) as T;
    } catch (parseError) {
      throw new Error(`Failed to parse data for key: ${key}`);
    }
  } catch (error) {
    // Re-throw as a plain Error to avoid NSException conversion issues
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`SecureStore error for key: ${key}`);
  }
}

export async function serializeAndSaveToSecureStore(key: string, obj: unknown): Promise<void> {
  if (!obj) {
    throw new Error('Object must be provided');
  }
  try {
    // Convert the object to a JSON string
    const jsonString = JSON.stringify(obj);
    // Set the JSON string to secure store
    await SecureStore.setItemAsync(key, jsonString);
  } catch (error) {
    // Re-throw as a plain Error to avoid NSException conversion issues
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to save data to SecureStore for key: ${key}`);
  }
}

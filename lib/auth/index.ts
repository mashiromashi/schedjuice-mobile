import { getItemAsync, setItemAsync } from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAxiosError } from 'axios';
import { axiosClient } from '@/lib/api';
import { Toast } from 'toastify-react-native';

type normalLoginProps = {
  email: string;
  password: string;
  isMicrosoft: false;
  onError: (e: any) => void;
};
type microsoftLoginProps = {
  isMicrosoft: true;
  clientId: string;
  authority: string;
};
type loginProps = normalLoginProps | microsoftLoginProps;

export async function login(props: loginProps) {
  if (props.isMicrosoft) {
    //!to be implemented later
    // try {
    //     const msal = getMsalInstance(props.clientId, props.authority);
    //     await msal.initialize();
    //     if (InteractionStatus.None) {
    //         const msResponse = await msal.loginPopup({
    //             scopes: ["openid", "profile", "User.Read"]
    //         });
    //         const response = await axiosClient.post("ms-login", { token: msResponse.accessToken }, { headers: { Accept: "application/json" } });
    //         setCookie("access", response.data.access, { expires: moment(new Date(), "DD-MM-YYYY").add(2, "hours").toDate() });
    //         setCookie("account", response.data.user, { expires: moment(new Date(), "DD-MM-YYYY").add(2, "hours").toDate() });
    //     }
    //     return true;
    // } catch (err) {
    //     console.log(err);
    //     return false;
    // }
  } else {
    try {
      const response = await axiosClient.post('/login', {
        email: props.email,
        password: props.password,
      });
      // Store sensitive tokens in SecureStore
      await setItemAsync('access', response.data.access);
      await setItemAsync('schema', response.data.schema_name);
      // Store user account data in AsyncStorage (less sensitive, reduces SecureStore calls)
      await AsyncStorage.setItem('account', JSON.stringify(response.data.user));
      return response;
    } catch (e: any) {
      if (isAxiosError(e)) {
        if (e.response?.status === 401) {
          Toast.show({
            type: 'error',
            text1: 'Login Failed',
            text2: 'Invalid email or password.',
            visibilityTime: 3000,
          });
        }
        if (e.response?.status === 400) {
          Toast.show({
            type: 'error',
            text1: 'Login Failed',
            text2: e.response.data.details[0],
            visibilityTime: 3000,
          });
        }
      }
      props.onError(e);
      return e;
    }
  }
}

export async function logout() {
  try {
    // Clear sensitive tokens from SecureStore
    await setItemAsync('access', '');
    await setItemAsync('schema', '');
    // Clear user account data from AsyncStorage
    await AsyncStorage.removeItem('account');
    Toast.show({
      type: 'success',
      text1: 'Logged out successfully.',
      visibilityTime: 2000,
    });
  } catch (e) {
    console.error('Logout error:', e);
    Toast.show({
      type: 'error',
      text1: 'Logout Failed',
      text2: 'Failed to log out. Please try again.',
      visibilityTime: 3000,
    });
  }
}

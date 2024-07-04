import { User } from "../../../common/interface/User";
import { Response } from "../../../common/types/res/response.type";
import { setAsyncStorage } from "../../../common/utils/cookie";
import { fetcher } from "../../../common/utils/fetcher";
import AsyncStorage from '@react-native-async-storage/async-storage';


export type AuthDto = {
     token: any;
     user: User;
}

class AuthServices {
     // LOGIN
     async login(payload: any): Promise<AuthDto | any> {
          // Response
          const res: Response = await fetcher({
               method: 'POST',
               url: '/auth/login',
               payload: payload
          });

          if (res?.status === 200) {
               // Token
               const token = res?.data?.token;


               setAsyncStorage('token', token.accessToken);

               setAsyncStorage('user', res?.data?.user);


               // Return data
               return Promise.resolve(res?.data);
          }

          // Return error
          return Promise.resolve(false);
     }

     // LOGIN
     async register(payload: any): Promise<boolean> {

          // Response
          const res: Response = await fetcher({
               method: 'POST',
               url: '/auth/register',
               payload: payload
          });

          if (res?.status === 200) {
               // Return data
               return Promise.resolve(res?.status === 200);
          }


          // Return error
          return Promise.resolve(false);
     }
     async sendResetPass(payload: any): Promise<boolean> {

          // Response
          const res: Response = await fetcher({
               method: 'POST',
               url: '/auth/sendResetPass',
               payload: payload
          });

          if (res?.status === 200) {
               // Return data
               return Promise.resolve(res?.status === 200);
          }


          // Return error
          return Promise.resolve(false);
     }
     async sendOtp(payload: any): Promise<boolean> {

          // Response
          const res: Response = await fetcher({
               method: 'POST',
               url: '/auth/sendOtp',
               payload: payload
          });

          if (res?.status === 200) {
               // Return data
               return Promise.resolve(res?.status === 200);
          }


          // Return error
          return Promise.resolve(false);
     }
     async verifyOTP(payload: any): Promise<boolean> {

          // Response
          const res: Response = await fetcher({
               method: 'POST',
               url: '/auth/verifyOTP',
               payload: payload
          });

          if (res?.status === 200) {
               // Return data
               return Promise.resolve(res?.status === 200);
          }


          // Return error
          return Promise.resolve(false);
     }
     async updatePassword(payload: any): Promise<boolean> {

          // Response
          const res: Response = await fetcher({
               method: 'POST',
               url: '/auth/updatePassword',
               payload: payload
          });

          if (res?.status === 200) {
               // Return data
               return Promise.resolve(res?.status === 200);
          }


          // Return error
          return Promise.resolve(false);
     }

}

// eslint-disable-next-line import/no-anonymous-default-export
export default new AuthServices();
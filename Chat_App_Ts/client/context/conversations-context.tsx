import { Conversations } from '../../common/interface/Conversations';
import React from 'react';
import { useAuth } from '../hooks/use-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Message Context
export const ConversationsContext = React.createContext(null);

interface Props {
  children: React.ReactNode;
}

const ConversationsProvider: React.FC<Props> = ({ children }: Props) => {
  // Conversations List
  const [conversations, setConversations] = React.useState<Conversations[] | null>();


  // Lay ra user_id tu useAuth
  const user_id: string = useAuth()?.get?._id;

  // console.log(user_id);
  // Current consersation
  const [currentCvs, setCurrentCvs] = React.useState<Conversations | null>(null);



  // Ham nay su dung de khi m gui tin nhan thi no se update luon o phan tin nhan nhanh (last_message)
  const updateCurrentCvs = async (cvs: Conversations) => {
    // Set current conversation
    hanleSetCurrentCvs(cvs);

    // Find index
    const i: number | undefined = conversations?.findIndex(
      (c) => c._id === cvs._id,
    );
    // console.log(i);

    // New conversation
    const newCvs = conversations;



    // Check and set data
    if (newCvs && i !== -1 && i !== undefined) {
      // Set new data
      newCvs[i] = { ...newCvs[i], ...cvs };

      // Set conversation
      setConversations(newCvs);

    }

  };
  // Update list conversation
  const updateListCvs = (cvs: Conversations) => {
    // Set new conversation
    setConversations((prev) => prev?.map((item) => item?._id === cvs?._id ? cvs : item));
  };

  // Handle set current conversation
  const hanleSetCurrentCvs = async (cvs: Conversations) => {
    // Set to session
    await AsyncStorage.setItem(
      'tshus.current.conversation', // Corrected key
      JSON.stringify({ user_id, cvs })
    );
    // Set current cvs
    setCurrentCvs(cvs);
  }
  // Shared Data
  const sharedData: any = {
    list: {
      get: conversations,
      set: setConversations,
      update: updateListCvs,
    },
    current: {
      get: currentCvs,
      set: hanleSetCurrentCvs,
      update: updateCurrentCvs
    },
  };

  // Return
  return (
    <ConversationsContext.Provider value={sharedData}>
      {children}
    </ConversationsContext.Provider>
  );
};

export default ConversationsProvider;

import React, { useContext } from 'react';
import { ConversationsContext } from '../context/conversations-context';

// Use Message
export const useConversations: Function = () => {

  const conversationContext = useContext<any>(ConversationsContext);

  if (!conversationContext) throw new Error('Không tìm thấy dữ liệu lưu trữ');

  // Return
  return conversationContext;
}



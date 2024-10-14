// api.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getChatList = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    if (!user) {
      throw new Error('User data not found in storage');
    }

    const parsedUser = JSON.parse(user);
    const user_id = parsedUser.id;

    if (!user_id) {
      throw new Error('User ID not found in storage');
    }

    const response = await fetch(`https://amanda.capraworks.com/api/chatlist.php?user_id=${user_id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching chat list:', error);
    throw error;
  }
};
  
  // Similarly, ensure other functions are defined and exported
  export const getMessages = async (senderId, receiverId) => {
    try {
      const response = await fetch(`https://amanda.capraworks.com/api/get_messages.php?sender_id=${senderId}&receiver_id=${receiverId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  };
  
  export const sendMessage = async (senderId, receiverId, message) => {
    try {
      const response = await fetch('https://amanda.capraworks.com/api/send_message.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender_id: senderId, receiver_id: receiverId, message })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };
  
import axios from 'axios';

const API_URL = 'https://amanda.capraworks.com/api/';

// Function to send a message
export const sendMessage = async (senderId, receiverId, message) => {
    try {
        console.log('Sending message with parameters:', { senderId, receiverId, message });

        if (!senderId || !receiverId || !message) {
            throw new Error('Missing parameters');
        }

        const response = await axios.post(`${API_URL}send_message.php`, {
            sender_id: senderId,
            receiver_id: receiverId,
            message: message
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        

        console.log('API response:', response.data);

        if (response.data.status === 'success') {
            return response.data;
        } else {
            throw new Error(response.data.message || 'Unknown error');
        }
    } catch (error) {
        console.error('Error sending message:', error.message || error);
        throw error;
    }
};

export const getMessages = async (senderId, receiverId) => {
    try {
        console.log('Fetching messages with parameters:', { senderId, receiverId });

        if (!senderId || !receiverId) {
            throw new Error('Missing parameters');
        }

        const response = await axios.get(`${API_URL}get_messages.php`, {
            params: {
                sender_id: senderId,
                receiver_id: receiverId
            }
        });

        console.log('API response:', response.data);

        if (Array.isArray(response.data)) {
            return response.data;
        } else {
            throw new Error('Unexpected response format');
        }
    } catch (error) {
        console.error('Error fetching messages:', error.message || error);
        throw error;
    }
};




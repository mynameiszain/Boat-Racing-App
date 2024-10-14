// api.js
export const addMemberToGroup = async (groupId, userId) => {
    try {
        const response = await fetch('https://amanda.capraworks.com/api/add_member_to_group.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                group_id: groupId,
                user_id: userId,
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.text();
    } catch (error) {
        console.error('Error adding member to group:', error);
    }
};

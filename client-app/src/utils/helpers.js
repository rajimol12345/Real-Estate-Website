const API_URL = 'http://localhost:5005';

export const getImageUrl = (imagePath, directory = 'property') => {
    if (!imagePath) {
        return 'https://via.placeholder.com/300x200'; // Return a placeholder if no image path
    }
    if (imagePath.startsWith('http')) {
        return imagePath; // It's already a full URL
    }
    // If it already has a leading slash (like /uploads/...), just prepend API_URL
    if (imagePath.startsWith('/')) {
        return `${API_URL}${imagePath}`;
    }
    // Prepend API_URL and the specified directory
    return `${API_URL}/${directory}/${imagePath}`;
};

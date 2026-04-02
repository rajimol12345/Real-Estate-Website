import { API_BASE_URL } from '../services/api';

export const getImageUrl = (imagePath, directory = 'property') => {
    if (!imagePath) {
        return 'https://via.placeholder.com/300x200'; // Return a placeholder if no image path
    }
    if (imagePath.startsWith('http')) {
        return imagePath; // It's already a full URL
    }
    // If it already has a leading slash (like /uploads/...), just prepend API_BASE_URL
    if (imagePath.startsWith('/')) {
        return `${API_BASE_URL}${imagePath}`;
    }
    // Prepend API_BASE_URL and the specified directory
    return `${API_BASE_URL}/${directory}/${imagePath}`;
};

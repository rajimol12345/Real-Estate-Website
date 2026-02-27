const API_URL = 'http://localhost:5005';

export const getImageUrl = (imagePath) => {
    if (!imagePath) {
        return 'https://via.placeholder.com/300x200';
    }
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    // If it already has a leading slash (like /uploads/...), just prepend API_URL
    if (imagePath.startsWith('/')) {
        return `${API_URL}${imagePath}`;
    }
    // Default fallback to /property/ for legacy simple filenames
    return `${API_URL}/property/${imagePath}`;
};

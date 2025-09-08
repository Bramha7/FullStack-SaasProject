export const generateRandomInstituteNumber = () => {
  return Math.floor(Math.random() * 900000) + 100000; // Generates a random 6-digit number
};

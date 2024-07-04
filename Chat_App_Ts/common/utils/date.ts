import moment from 'moment';

export const formatDate = (dateString: string): string => {
  // Check is valid
  if (!dateString) return '';
  
  // Original
  const originalDateTime = moment(dateString);

  // Format to AM or PM
  const formattedTime = originalDateTime.format('h:mm a');

  // Return
  return formattedTime.toUpperCase();
};

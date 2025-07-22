export const formatDateTime = (timestamp: bigint): string => {
  const date = new Date(Number(timestamp));
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const formatDate = (timestamp: bigint): string => {
  const date = new Date(Number(timestamp));
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (timestamp: bigint): string => {
  const date = new Date(Number(timestamp));
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const isEventUpcoming = (timestamp: bigint): boolean => {
  const eventDate = new Date(Number(timestamp));
  const now = new Date();
  return eventDate > now;
};

export const getRelativeTime = (timestamp: bigint): string => {
  const date = new Date(Number(timestamp));
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  
  if (diff < 0) {
    return 'Past event';
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `In ${days} day${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `In ${hours} hour${hours > 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `In ${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else {
    return 'Starting soon';
  }
};

export const convertToTimestamp = (dateString: string): bigint => {
  return BigInt(new Date(dateString).getTime());
};
// Function to generate a random date-time string within the last 3 months
export function getRandomDateTime(): string {
  // Current time
  const now = new Date();

  // Calculate the exact date 3 months ago
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(now.getMonth() - 3);

  // Generate a random timestamp between `threeMonthsAgo` and `now`
  const randomTimestamp =
    threeMonthsAgo.getTime() +
    Math.random() * (now.getTime() - threeMonthsAgo.getTime());

  // Convert the random timestamp back to a Date object
  const randomDate = new Date(randomTimestamp);

  // Format the date to "YYYY-MM-DD HH:MM:SS"
  const year = randomDate.getFullYear();
  const month = String(randomDate.getMonth() + 1).padStart(2, "0");
  const day = String(randomDate.getDate()).padStart(2, "0");
  const hours = String(randomDate.getHours()).padStart(2, "0");
  const minutes = String(randomDate.getMinutes()).padStart(2, "0");
  const seconds = String(randomDate.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function getRandomLastSeenAndExpiry(): { 
  last_seen_time: number; 
  expiry_time: number; 
} {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds (epoch)

  // Calculate 2 weeks ago in seconds
  const twoWeeksAgo = now - 14 * 24 * 60 * 60;

  // Generate a random last_seen_time in the last 2 weeks
  const lastSeenTime = Math.floor(
    twoWeeksAgo + Math.random() * (now - twoWeeksAgo)
  );

  // Generate a random expiry_time between lastSeenTime and now
  const expiryTime = Math.floor(
    lastSeenTime + Math.random() * (now - lastSeenTime)
  );

  return {
    last_seen_time: lastSeenTime,
    expiry_time: expiryTime,
  };
}

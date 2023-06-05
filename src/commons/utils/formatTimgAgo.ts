import moment from "moment";

export default function formatTimeAgo(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60000) {
    return "just now";
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)} minutes ago`;
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)} hours ago`;
  } else if (diff < 2592000000) {
    return `${Math.floor(diff / 86400000)} days ago`;
  } else if (diff < 31536000000) {
    const months = Math.floor(diff / 2592000000);
    return `${months} ${months > 1 ? "months" : "month"} ago`;
  } else {
    return moment(date).format("YYYY-MM-DD");
  }
}

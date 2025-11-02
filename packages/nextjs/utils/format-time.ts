import { formatDistanceToNow } from "date-fns";

function timeAgo(timestamp: string) {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
}

export default timeAgo;

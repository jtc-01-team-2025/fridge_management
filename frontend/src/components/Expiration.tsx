export const ExpirationStatus = ({ date_expiration }: { date_expiration: string }) => {
  let label = "";
  let className = "py-1 px-3 rounded-full text-xs font-semibold whitespace-nowrap";
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expire = new Date(date_expiration);
  expire.setHours(0, 0, 0, 0);

  const diffMs = expire.getTime() - today.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 0) {
    className += " bg-red-200 text-red-800 border border-red-300";
    label = "期限切れ";
  } else if (diffDays <= 7) {
    className += " bg-yellow-200 text-yellow-800 border border-yellow-300 animate-pulse";
    label = "1週間以内";
  } else {
    className += " bg-green-200 text-green-800 border border-green-300";
    label = "安全";
  }
  return <span className={className}>{label}</span>;
};

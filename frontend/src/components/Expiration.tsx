export const ExpirationStatus = ({ date_expiration }: { date_expiration: string }) => {
  let label = "";
  let className = "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expire = new Date(date_expiration);
  expire.setHours(0, 0, 0, 0);

  const diffMs = expire.getTime() - today.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 0) {
    className = "badge expired";
    label = "期限切れ";
  } else if (diffDays <= 7) {
    className = "badge warning";
    label = "1週間以内";
  } else {
    className = "badge safe";
    label = "安全";
  }
  return <span className={className}>{label}</span>;
};

import moment from 'moment';

// 计算给定日期到目前的剩余时间
export default function timeRemaining(time) {
  if (time === '') {
    return 'N/A';
  }

  const now = moment();
  const deadline = moment(time);

  const duration = moment.duration(deadline.diff(now));
  const days = Math.floor(duration.asDays());
  const hours = duration.hours();
  const minutes = duration.minutes();

  let remainingTime = '';

  if (days > 0) {
    remainingTime += `${days}天`;
  }

  if (hours > 0 || days > 0) {
    remainingTime += `${hours}小時`;
  }

  if (minutes > 0 || hours > 0 || days > 0) {
    remainingTime += `${minutes}分鐘`;
  }

  return remainingTime;
}

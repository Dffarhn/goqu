import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/id";

dayjs.locale("id");
dayjs.extend(utc);
dayjs.extend(timezone);

const formatDateWIB = (isoDate) => {
  return (
    dayjs.utc(isoDate).tz("Asia/Jakarta").format("DD MMMM YYYY, HH:mm") + " WIB"
  );
};

export default formatDateWIB;

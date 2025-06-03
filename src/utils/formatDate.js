import dayjs from "dayjs";
import "dayjs/locale/id"; // import locale Indonesia
dayjs.locale("id"); // set ke bahasa Indonesia

const formatDateWIB = (isoDate) => {
  return dayjs(isoDate).add(7, "hour").format("DD MMMM YYYY, HH:mm") + " WIB";
};

export default formatDateWIB;
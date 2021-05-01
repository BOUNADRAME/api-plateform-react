import moment from 'moment';

const formatDate = (str) => moment(str).format("DD/MM/YYYY");

export default formatDate;
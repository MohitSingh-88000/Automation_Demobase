export const bookingData = {
  validBooking: {
    firstname: 'Jim',
    lastname: 'Brown',
    totalprice: 111,
    depositpaid: true,
    bookingdates: {
      checkin: '2018-01-01',
      checkout: '2019-01-01',
    },
    additionalneeds: 'Breakfast',
  },
  updatedBooking: {
    firstname: 'James',
    lastname: 'Brown',
    totalprice: 222,
    depositpaid: true,
    bookingdates: {
      checkin: '2020-02-02',
      checkout: '2020-02-15',
    },
    additionalneeds: 'Dinner',
  },
  invalidBooking: {
    firstname: '',
    lastname: 'Brown',
    totalprice: 111,
    depositpaid: true,
    bookingdates: {
      checkin: '2018-01-01',
      checkout: '2019-01-01',
    },
    additionalneeds: 'Breakfast',
  },
};

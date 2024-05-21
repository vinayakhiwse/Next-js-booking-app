import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const generateInvoice = (props) => {
  const {
    booking_number,
    celebrity_name,
    subtotal,
    total,
    service_name,
    total_booked_slots,
    booked_Time,
    booked_Date,
    user_name,
    user_email,
    user_phone_number,
    payment,
    booking_address,
    vat,
    discount,
  } = props;

  const styles = StyleSheet.create({
    page: {
      fontFamily: "Helvetica",
      paddingTop: 35,
      paddingLeft: 35,
      paddingRight: 35,
      paddingBottom: 65,
    },
    title: {
      fontSize: 24,
      textAlign: "center",
      marginBottom: 40,
    },

    separateDiv: {
      marginBottom: 15,
    },
    subtitle: {
      fontSize: 18,
      margin: 12,
      display: "flex",
      gap: 5,
    },
    subtitleDiv: {
      fontSize: 15,
      marginHorizontal: 10,
      marginBottom: 10,
      display: "flex",
      gap: 5,
      color: "#343434",
    },
    detailMainArea: {
      backgroundColor: "#dc9c44",
      padding: "1.7rem 2rem 1rem",
      boxShadow: "0px 0px 6px rgba(0, 0, 0, 0.16)",
      border: "1px solid #eee",
    },
    borderDiv: {
      border: "1px soild #eee",
      marginBottom: "1.5rem",
    },
    dateDiv: {
      color: "#999",
      fontSize: 14,
    },
    bookingDiv: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      color: "#fff",
    },
    stadiumName: {
      fontSize: 28,
      fontWeight: "extrabold",
      marginVertical: 10,
      marginHorizontal: 10,
    },
    supplierDiv: {
      padding: "1.7rem 2rem 1rem",
      boxShadow: "0px 0px 6px rgba(0, 0, 0, 0.16)",
      border: "1px solid #eee",
    },
    supplierName: {
      marginTop: 10,
      fontSize: 15,
      marginHorizontal: 10,
      marginBottom: 10,
      display: "flex",
      justifyContent: "space-between",
      gap: 5,
      color: "#343434",
    },
    price: {
      color: "#999",
      fontSize: 14,
      marginHorizontal: 10,
    },
    bookingType: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.separateDiv}>
          <View style={styles.detailMainArea}>
            <View style={styles.bookingDiv}>
              <Text style={styles.subtitle}>Booking ID: {booking_number}</Text>
              {/* <Text style={styles.subtitle}>Status: {booking.status}</Text> */}
            </View>
          </View>
          <View style={styles.borderDiv}>
            Celebrity Name:-{" "}
            <Text style={styles.stadiumName}>{celebrity_name}</Text>
            <Text style={styles.subtitleDiv}>
              Booked Date: <Text style={styles.dateDiv}>{booked_Date}</Text>
            </Text>
            <Text style={styles.subtitleDiv}>
              Booked Time:{" "}
              <Text style={styles.dateDiv}>
                {booked_Time[0].times.at(0)} - {booked_Time[0].times.at(-1)}
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.separateDiv}>
          <View style={styles.supplierDiv}>
            <Text style={styles.subtitle}>Booked By</Text>
          </View>

          <View style={styles.borderDiv}>
            <Text style={styles.supplierName}>
              Name: <Text style={styles.dateDiv}>{user_name}</Text>
            </Text>
            <Text style={styles.subtitleDiv}>
              Email: <Text style={styles.dateDiv}>{user_email}</Text>
            </Text>
            <Text style={styles.subtitleDiv}>
              Phone Number:{" "}
              <Text style={styles.dateDiv}>{user_phone_number}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.separateDiv}>
          <View style={styles.supplierDiv}>
            <Text style={styles.subtitle}>Payment Method</Text>
          </View>
          <View style={styles.borderDiv}>
            <Text style={styles.supplierName}>
              <Text style={styles.dateDiv}>{payment}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.separateDiv}>
          <View style={styles.supplierDiv}>
            <Text style={styles.subtitle}>Location</Text>
          </View>

          <View style={styles.borderDiv}>
            <Text style={styles.supplierName}>
              <Text style={styles.dateDiv}>
                {booking_address.address
                  ? booking_address?.address
                  : booking_address.address}
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.separateDiv}>
          <View style={styles.supplierDiv}>
            <Text style={styles.subtitle}>Celebrity Information</Text>
          </View>

          <View style={styles.borderDiv}>
            <Text style={styles.supplierName}>
              Name: <Text style={styles.dateDiv}>{celebrity_name}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.separateDiv}>
          <View style={styles.supplierDiv}>
            <Text style={styles.subtitle}>Service Information</Text>
          </View>

          <View style={styles.borderDiv}>
            <Text style={styles.supplierName}>
              Name: <Text style={styles.dateDiv}>{service_name}</Text>
            </Text>

            <Text style={styles.subtitleDiv}>
              Price: <Text style={styles.dateDiv}>SAR {subtotal}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.separateDiv}>
          <View style={styles.supplierDiv}>
            <Text style={styles.subtitle}>Booking Summary</Text>
          </View>

          <View style={styles.borderDiv}>
            <View style={styles.bookingType}>
              <Text style={styles.supplierName}>Service Price </Text>
              <Text style={styles.price}>SAR {subtotal}</Text>
            </View>

            <View style={styles.bookingType}>
              <Text style={styles.supplierName}>Total Slots:</Text>

              <Text style={styles.price}>{total_booked_slots}</Text>
            </View>
            <View style={styles.bookingType}>
              <Text style={styles.supplierName}>Vat:</Text>

              <Text style={styles.price}>{vat}%</Text>
            </View>
            <View style={styles.bookingType}>
              <Text style={styles.supplierName}>Coupon:</Text>

              <Text style={styles.price}>{discount}%</Text>
            </View>
          </View>

          <View style={styles.detailMainArea}>
            <View style={styles.bookingDiv}>
              <Text style={styles.subtitle}>Total</Text>
              <Text style={styles.subtitle}>SAR {total}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default generateInvoice;

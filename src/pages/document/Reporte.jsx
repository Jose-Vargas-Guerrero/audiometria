import { Page,Text,View,Document,StyleSheet,PDFDownloadLink,Image } from "@react-pdf/renderer";


const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    borderBottom: "1px solid #000",
    paddingBottom: 10,
    marginBottom: 10,
    textAlign: "center",
  },
  footer: {
    borderTop: "1px solid #000",
    paddingTop: 10,
    marginTop: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 15,
    padding: 10,
    border: "1px solid #ccc",
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  image: {
    marginVertical: 10,
    marginHorizontal: "auto",
    width: 200,
    height: 200,
  },
  separator: {
    borderTop: "1px solid #000",
    marginVertical: 10,
  },
});

// eslint-disable-next-line react/prop-types
const MyDocument = ({nombre,edad,observaciones,recomendaciones,fecha,imagen}) => (
  <Document>
    <Page style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Centro Otaudiológico del Sur</Text>
        <Text style={styles.text}>Choluteca {fecha}</Text>
      </View>

      {/* Nombre del paciente y datos */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Datos del Paciente</Text>
        <Text style={styles.text}>Nombre: {nombre}</Text>
        <Text style={styles.text}>Edad: {edad}</Text>
        <Text style={styles.text}>El Triunfo, Choluteca</Text>
      </View>

      {/* Examen Médico */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Audiograma</Text>
        {imagen && <Image style={styles.image} src={imagen} />}
      </View>

      {/* Observaciones */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Observaciones</Text>
        <Text style={styles.text}>
          {observaciones}
        </Text>
      </View>

      {/* Recomendaciones */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Recomendaciones</Text>
        <Text style={styles.text}>
          {recomendaciones}
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.text}>Dr. Carlos Enrique Guillen Otorrinolaringólogo Cel. 99535900</Text>
        <Text style={styles.text}>Dr. Jorge Luis Guevara Otorrinolaringólogo Cel. 99982543</Text>
      </View>
    </Page>
  </Document>
);

// eslint-disable-next-line react/prop-types
function Reporte({nombre,edad,observaciones,recomendaciones,fecha,imagen}) {
  return (
    <>
    <div>
        <PDFDownloadLink
        document={<MyDocument nombre={nombre} edad={edad} fecha={fecha} observaciones={observaciones} recomendaciones={recomendaciones} imagen={imagen}/>}
        fileName="reporte-ejemplo.pdf"
        >
            descargar
        </PDFDownloadLink>
    </div>
    </>
  )
}

export default Reporte
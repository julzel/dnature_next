import Head from "next/head";

// local imports
import Page from "../../components/Page";
import Faq from "../../features/Faq";

export default function App() {
  return (
    <Page title="DNAture - Preguntas frecuentes">
      <Faq />
    </Page>
  );
}

import Head from "next/head";

// local imports

// components
import Page from "../../components/Page";
import Calculator from "../../features/Calculator";

export default function App() {
  return (
    <Page title="Calcula la porción ideal de comida para tu mascota">
      <Calculator />
    </Page>
  );
}

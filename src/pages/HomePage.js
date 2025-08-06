import { useIntl } from "react-intl";
import BackgroundImage from "../components/BackgroundImage";

export default function HomePage({ locale, setLocale }) {
  useIntl();

  return (
    <main className="page home">
      <section>
        <BackgroundImage url="/images/home-banner.jpg" />

        <div className="content">
          <h2>Welcome to</h2>
          <h1>Mantle of Praise</h1>
        </div>
      </section>

      <section className="secondary"></section>

      <section className="primary"></section>
    </main>
)  ;


}

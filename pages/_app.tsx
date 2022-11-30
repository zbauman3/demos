import type { AppProps } from "next/app";
import { systemStylesClass } from "../ve-styles/theme.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={systemStylesClass}>
      <Component {...pageProps} />
    </div>
  );
}

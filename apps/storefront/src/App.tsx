import AppRouter from "./lib/router";
import SupportPanel from "./components/organisms/SupportPanel";
import "./index.css";
export default function App() {
  return (
    <>
      <SupportPanel /> {/* Always available on all pages */}
      <AppRouter />
    </>
  );
}

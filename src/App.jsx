import SiteRoutes from "./routes/SiteRoutes";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="
      relative min-h-screen flex flex-col w-full overflow-x-hidden
      bg-linear-to-br
      from-indigo-100 via-blue-100 to-purple-100
      dark:from-slate-900
      dark:via-slate-800
      dark:to-indigo-950
    ">
      
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-400/30 dark:bg-indigo-600/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-400/30 dark:bg-purple-700/20 blur-3xl rounded-full" />
      </div>

      <main className="relative z-10 grow w-full flex flex-col">
        <SiteRoutes />
      </main>

      <div className="relative z-10 shrink-0 w-full">
        <Footer />
      </div>

    </div>
  );
}

export default App;
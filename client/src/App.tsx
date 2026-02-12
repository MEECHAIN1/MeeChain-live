import { Switch, Route } from "wouter";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DashboardPage from "./pages/DashboardPage";
import GalleryPage from "./pages/GalleryPage";
import StakingPage from "./pages/StakingPage";
import SwapPage from "./pages/SwapPage";
import SummonPage from "./pages/SummonPage";
import MintPage from "./pages/MintPage";
import OraclePage from "./pages/OraclePage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={DashboardPage} />
      <Route path="/gallery" component={GalleryPage} />
      <Route path="/staking" component={StakingPage} />
      <Route path="/swap" component={SwapPage} />
      <Route path="/summon" component={SummonPage} />
      <Route path="/mint" component={MintPage} />
      <Route path="/oracle" component={OraclePage} />
      <Route>
        <div className="flex items-center justify-center min-h-[60vh] text-white font-black uppercase tracking-widest">
          404 - Neural Path Not Found
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <AppProvider>
      <div className="bg-ritual"></div>
      <div className="min-h-screen flex flex-col selection:bg-amber-500/30 relative pb-safe">
        <Navbar />
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 md:py-10">
          <Router />
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
}

export default App;

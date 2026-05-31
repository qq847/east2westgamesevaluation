import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import PasswordGate from "./components/PasswordGate";
import Home from "./pages/Home";
import AssessmentDetail from "./pages/AssessmentDetail";
import History from "./pages/History";
import Compare from "./pages/Compare";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/assessment/:id"} component={AssessmentDetail} />
      <Route path={"/history"} component={History} />
      <Route path={"/compare"} component={Compare} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster richColors position="top-right" />
          <PasswordGate>
            <Router />
          </PasswordGate>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { RoofCheck } from "@/components/RoofCheck";
import { FAQ } from "@/components/FAQ";
import { Testimonials } from "@/components/Testimonials";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RoofCheck address="Your Address Here" />
        <FAQ />
        <Testimonials />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
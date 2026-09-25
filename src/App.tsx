import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import RoutesAdm from "./routes/RoutesAdm";


const queryClient = new QueryClient();

function App() {
	return (
		<ThemeProvider>
			<BrowserRouter>
				<QueryClientProvider client={queryClient}>
					<TooltipProvider>
						<Toaster />
						<Sonner />
						<AuthProvider>
							<RoutesAdm />
						</AuthProvider>
					</TooltipProvider>
				</QueryClientProvider>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
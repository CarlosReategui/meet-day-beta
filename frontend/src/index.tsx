import { CookiesProvider } from "react-cookie";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AuthProvider, CurrentMeetProvider } from "./context";
import { ThemeProvider } from "./ThemeProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ThemeProvider>
    <CookiesProvider>
      <BrowserRouter>
        <AuthProvider>
          <CurrentMeetProvider>
            <App />
          </CurrentMeetProvider>
        </AuthProvider>
      </BrowserRouter>
    </CookiesProvider>
  </ThemeProvider>
);

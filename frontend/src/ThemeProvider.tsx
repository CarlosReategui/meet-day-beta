import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  MantineThemeOverride,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { useCookies } from "react-cookie";
import { ModalsProvider } from "@mantine/modals";

export const theme: MantineThemeOverride = {};

interface ThemeProviderProps {
  children: React.ReactNode;
}

const PRIMARY_THEME = "light";
const SECONDARY_THEME = "dark";

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [cookies, setCookie] = useCookies(["colorScheme"]);

  const toggleColorScheme = (value?: ColorScheme) => {
    setCookie(
      "colorScheme",
      !cookies.colorScheme
        ? SECONDARY_THEME
        : cookies.colorScheme === PRIMARY_THEME
        ? SECONDARY_THEME
        : PRIMARY_THEME,
      { path: "/" }
    );
  };

  return (
    <ColorSchemeProvider
      colorScheme={cookies.colorScheme || PRIMARY_THEME}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ ...theme, colorScheme: cookies.colorScheme || PRIMARY_THEME }}
        withGlobalStyles
        withNormalizeCSS
      >
        <Notifications />
        <ModalsProvider>{children}</ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

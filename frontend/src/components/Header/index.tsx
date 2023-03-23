import { Button, Flex, Header, Text, useMantineTheme } from "@mantine/core";
import { useAuth } from "../../context";

export const AppHeader = () => {
  const { logout } = useAuth();
  const theme = useMantineTheme();
  return (
    <Header height={75} mb="xl">
      <Flex align="center" direction="column" mt="md">
        {/* <Text color="dimmed">
          This is supposed to be a header, but it's not implemented yet.
        </Text> */}
        <Flex>
          <Button onClick={logout} compact>
            logout
          </Button>
        </Flex>
      </Flex>
    </Header>
  );
};

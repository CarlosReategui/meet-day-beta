import {
  Button,
  Container,
  Flex,
  PasswordInput,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useAuth } from "../../context/AuthContext";

export const Login = () => {
  const { login } = useAuth();

  const form = useForm({
    initialValues: { username: "", password: "" },
    validate: {
      username: (value) => !value && "Username is required",
      password: (value) => !value && "Password is required",
    },
  });

  const onClick = async () => {
    console.log(form.values);
    if (!form.validate().hasErrors) {
      try {
        await login(form.values.username, form.values.password);
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Check your credentials.",
          color: "red",
        });
      }
    }
  };

  return (
    <Flex direction="column" align="center">
      <Title order={1} mt="xl">
        Meet Day Beta
      </Title>
      <Container size={500} mt="lg">
        <TextInput label="username" {...form.getInputProps("username")} />
        <PasswordInput label="password" {...form.getInputProps("password")} />
        <Button fullWidth mt="lg" onClick={onClick}>
          login
        </Button>
      </Container>
    </Flex>
  );
};

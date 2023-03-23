import {
  Button,
  Container,
  Grid,
  Modal,
  Select,
  Skeleton,
  Space,
  TextInput,
} from "@mantine/core";
import { AppBreadcrumbs } from "../../components";
import { useAuth } from "../../context";
import { useEffect, useState } from "react";
import { clientService } from "../../api";
import { TMeet } from "../../types";
import { MeetCard } from "../../components/MeetCard";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { openConfirmModal } from "@mantine/modals";

export const MyMeetsPage = () => {
  const form = useForm({
    initialValues: { gender: "", title: "", location: "" },

    validate: {
      gender: (value) => value === "" && "Required field.",
      title: (value) => !value && "Required field.",
      location: (value) => !value && "Required field.",
    },
  });

  const { authCallbackOnPageLoad } = useAuth();
  const [meets, setMeets] = useState<TMeet[]>(null!);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    authCallbackOnPageLoad(() => {
      const getMeets = async () => {
        const response = await clientService.meets.get();
        setMeets(response.data);
      };

      getMeets();
    });
  }, [authCallbackOnPageLoad]);

  const addMeet = async () => {
    if (!form.validate().hasErrors) {
      try {
        const response = await clientService.meets.post({
          gender: form.values.gender,
          title: form.values.title,
          location: form.values.location,
        });
        setMeets([...meets, response.data]);
        close();
      } catch (error) {
        notifications.show({ title: "Error", message: "Something went wrong" });
      }
    }
  };

  const deleteMeet = async (id: number) => {
    openConfirmModal({
      title: "Delete meet",
      children: "Are you sure you want to delete this meet?",
      labels: {
        confirm: "Delete",
        cancel: "Cancel",
      },
      onConfirm: async () => {
        try {
          await clientService.meets.delete(id);
          setMeets(meets.filter((meet) => meet.id !== id));
        } catch (error) {
          notifications.show({
            title: "Error",
            message: "Something went wrong",
          });
        }
      },
    });
  };

  return (
    <Container>
      <Modal opened={opened} onClose={close} title="Add meet">
        <TextInput label="Title" {...form.getInputProps("title")} />
        <Select
          label="Gender"
          data={[
            { label: "Male", value: "MALE" },
            { label: "Female", value: "FEMALE" },
          ]}
          {...form.getInputProps("gender")}
        />
        <TextInput label="Location" {...form.getInputProps("location")} />
        <Button
          size="xs"
          color="green"
          variant="outline"
          onClick={addMeet}
          fullWidth
          mt="lg"
        >
          + add meet
        </Button>
      </Modal>
      <AppBreadcrumbs
        breadcrumbs={[{ link: "/my-meets", title: "My Meets" }]}
      />
      <Button size="xs" color="green" variant="outline" onClick={open}>
        + add meet
      </Button>
      <Space h="lg" />
      {!meets ? (
        <Skeleton height={300} />
      ) : (
        <Grid>
          {meets.map((meet) => (
            <Grid.Col key={meet.id} span={12} md={6}>
              <MeetCard meet={meet} deleteMeet={deleteMeet} />
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Container>
  );
};

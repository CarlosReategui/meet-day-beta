import { Button, Container, Flex, Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clientService } from "../../api";
import { AppBreadcrumbs } from "../../components";
import { Lifter } from "../../components";
import { useCurrentMeet } from "../../context";
import { TBackendLifter, TLifter } from "../../types";

export const MeetPage = () => {
  const { currentMeetCookie } = useCurrentMeet();
  const navigate = useNavigate();

  const [lifters, setLifters] = useState<TLifter[]>(null!);

  const form = useForm({
    initialValues: {
      lifterName: "",
    },

    validate: {
      lifterName: (value) => !value && "Required field.",
    },
  });

  useEffect(() => {
    const getLifters = async () => {
      if (currentMeetCookie) {
        try {
          const response = await clientService.meets.getParticipantsByMeetId(
            currentMeetCookie.id
          );
          const backendLifters: TBackendLifter[] = response.data;
          const cardLifters: TLifter[] = backendLifters.map((lifter) => ({
            id: lifter.id,
            name: lifter.name,
            weight: lifter.weight.toString(),
            squat: lifter.squat.toString(),
            bench: lifter.bench.toString(),
            deadlift: lifter.deadlift.toString(),
            total: (lifter.squat + lifter.bench + lifter.deadlift).toString(),
            points: "0",
            posByTotal: "0",
            posByPoints: "0",
          }));
          setLifters(cardLifters);
          form.setFieldValue("lifters", cardLifters);
        } catch (error) {
          console.log(error);
          setLifters([]);
        }
      }
    };

    if (!lifters) getLifters();
  }, [currentMeetCookie, lifters, form]);

  const [opened, { open, close }] = useDisclosure(false);

  if (!currentMeetCookie) {
    navigate("/my-meets");
    return null;
  } else {
    const addLifter = async () => {
      if (!form.validate().hasErrors) {
        const newLifter = {
          name: form.values.lifterName,
          meet: currentMeetCookie.id,
          squat: 0,
          bench: 0,
          deadlift: 0,
          weight: 0,
        };
        try {
          const response = await clientService.lifters.post(newLifter);
          const data: TBackendLifter = response.data;
          const cardLifter: TLifter = {
            id: data.id,
            name: data.name,
            weight: "0",
            squat: "0",
            bench: "0",
            deadlift: "0",
            total: "0",
            points: "0",
            posByTotal: "0",
            posByPoints: "0",
          };
          setLifters([...lifters, cardLifter]);
          onClose();
        } catch (error) {
          notifications.show({
            title: "Error",
            message: "Something went wrong. Please try again.",
          });
          console.log(error);
        }
      }
    };

    const onClose = () => {
      form.setFieldValue("lifterName", "");
      close();
    };

    const saveAll = async () => {
      lifters.forEach(async (lifter) => {
        const updatedLifter = {
          name: lifter.name,
          squat: parseInt(lifter.squat || "0"),
          bench: parseInt(lifter.bench || "0"),
          deadlift: parseInt(lifter.deadlift || "0"),
          weight: parseInt(lifter.weight || "0"),
        };
        try {
          await clientService.lifters.put(updatedLifter, lifter.id);
        } catch (error) {
          notifications.show({
            title: "Error",
            message: "Something went wrong. Please try again.",
          });
          console.log(error);
        }
      });
    };

    return (
      <Container>
        <Modal opened={opened} onClose={onClose} title="Add lifter">
          <TextInput label="Name" {...form.getInputProps("lifterName")} />
          <Button
            size="xs"
            color="green"
            variant="outline"
            onClick={addLifter}
            fullWidth
            mt="lg"
          >
            + add lifter
          </Button>
        </Modal>
        <AppBreadcrumbs
          breadcrumbs={[
            { title: "My Meets", link: "/my-meets" },
            {
              title: currentMeetCookie.title,
              link: `/my-meets/${currentMeetCookie.id}`,
            },
          ]}
        />
        <Container px={0}>
          <Flex gap="md">
            <Button color="green" variant="outline" size="xs" onClick={open}>
              + add lifter
            </Button>
            <Button size="xs" color="green" variant="outline" onClick={saveAll}>
              save all
            </Button>
          </Flex>
          {lifters &&
            lifters.map((lifter, index) => (
              <div key={index}>
                <Lifter
                  lifter={lifter}
                  lifters={lifters}
                  id={lifter.id}
                  setLifters={setLifters}
                  gender={currentMeetCookie.gender}
                />
              </div>
            ))}
        </Container>
      </Container>
    );
  }
};

import {
  Button,
  Container,
  Flex,
  Modal,
  Skeleton,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { openConfirmModal } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clientService } from "../../api";
import { AppBreadcrumbs, Standings } from "../../components";
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

  const [addLifterOpened, { open: openAddLifter, close: closeAddLifter }] =
    useDisclosure(false);

  const [standingsOpened, { open: openStandings, close: closeStandings }] =
    useDisclosure(false);

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
          onAddLifterClose();
        } catch (error) {
          notifications.show({
            title: "Error",
            message: "Something went wrong. Please try again.",
          });
          console.log(error);
        }
      }
    };

    const onAddLifterClose = () => {
      form.setFieldValue("lifterName", "");
      closeAddLifter();
    };

    const saveAll = async () => {
      lifters.forEach(async (lifter) => {
        const updatedLifter = {
          name: lifter.name,
          squat: parseFloat(lifter.squat || "0"),
          bench: parseFloat(lifter.bench || "0"),
          deadlift: parseFloat(lifter.deadlift || "0"),
          weight: parseFloat(lifter.weight || "0"),
          meet: currentMeetCookie.id,
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
      notifications.show({
        title: "Success",
        message: "Lifters updated successfully.",
        color: "green",
      });
    };

    const deleteLifter = (id: number) => {
      openConfirmModal({
        title: "Delete lifter",
        children: "Are you sure you want to delete this lifter?",
        labels: {
          confirm: "Delete",
          cancel: "Cancel",
        },
        onConfirm: async () => {
          try {
            await clientService.lifters.delete(id);
            setLifters(lifters.filter((lifter) => lifter.id !== id));
          } catch {
            notifications.show({
              title: "Error",
              message: "Something went wrong. Please try again.",
            });
          }
        },
      });
    };

    return (
      <Container>
        <Modal
          opened={addLifterOpened}
          onClose={onAddLifterClose}
          title="Add lifter"
        >
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
        <Modal
          opened={standingsOpened}
          onClose={closeStandings}
          title="Standings"
          size="auto"
        >
          <Standings lifters={lifters} />
        </Modal>
        <Container px={0}>
          <Flex gap="md">
            <Button
              color="green"
              variant="outline"
              size="xs"
              onClick={openAddLifter}
            >
              + add lifter
            </Button>
            <Button size="xs" color="green" variant="outline" onClick={saveAll}>
              save all
            </Button>
            <Button
              size="xs"
              color="orange"
              variant="outline"
              onClick={openStandings}
            >
              standings
            </Button>
          </Flex>
          {lifters ? (
            lifters.map((lifter, index) => (
              <div key={index}>
                <Lifter
                  lifter={lifter}
                  lifters={lifters}
                  id={lifter.id}
                  setLifters={setLifters}
                  gender={currentMeetCookie.gender}
                  deleteLifter={deleteLifter}
                />
              </div>
            ))
          ) : (
            <Skeleton height={200} mt="lg" />
          )}
        </Container>
      </Container>
    );
  }
};

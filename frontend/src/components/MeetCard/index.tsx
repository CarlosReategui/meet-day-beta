import { Badge, Button, Card, Group, Table, Text, Title } from "@mantine/core";
import { TMeet } from "../../types";
import { useNavigate } from "react-router-dom";
import { useCurrentMeet } from "../../context";
import { HiOutlineTrash } from "react-icons/hi";

type Props = {
  meet: TMeet;
  deleteMeet: (id: number) => void;
};

export const MeetCard = ({ meet, deleteMeet }: Props) => {
  const navigate = useNavigate();
  const { setCurrentMeetCookie } = useCurrentMeet();

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group position="apart">
        <Title order={4}>{meet.title}</Title>
        <Button size="xs" color="red" onClick={() => deleteMeet(meet.id)}>
          <HiOutlineTrash />
        </Button>
      </Group>
      <Table mt="xs">
        <tbody>
          <tr>
            <td>
              <Text color="dimmed">gender</Text>
            </td>
            <td>
              <Badge color="green">{meet.gender}</Badge>
            </td>
          </tr>
          {/* <tr>
            <td>
              <Text color="dimmed">date</Text>
            </td>
            <td>
              <Badge color="grape">{meet.date}</Badge>
            </td>
          </tr> */}
          {/* <tr>
            <td>
              <Text color="dimmed">total lifters</Text>
            </td>
            <td>
              <Badge color="yellow">{meet.participants.length}</Badge>
            </td>
          </tr> */}
          <tr>
            <td>
              <Text color="dimmed">location</Text>
            </td>
            <td>
              <Badge color="lime">{meet.location}</Badge>
            </td>
          </tr>
        </tbody>
      </Table>
      <Button
        fullWidth
        mt="lg"
        variant="outline"
        onClick={() => {
          setCurrentMeetCookie(meet);
          navigate(`/my-meets/${meet.id}`);
        }}
      >
        view meet
      </Button>
    </Card>
  );
};

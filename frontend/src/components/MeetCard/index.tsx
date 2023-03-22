import { Badge, Button, Card, Table, Text, Title } from "@mantine/core";
import { TMeet } from "../../types";
import { useNavigate } from "react-router-dom";
import { useCurrentMeet } from "../../context";

type Props = {
  meet: TMeet;
};

export const MeetCard = ({ meet }: Props) => {
  const navigate = useNavigate();
  const { setCurrentMeetCookie } = useCurrentMeet();

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={4}>{meet.title}</Title>
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

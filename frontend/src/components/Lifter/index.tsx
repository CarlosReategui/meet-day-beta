import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { Card, Grid, InputBase, TextInput } from "@mantine/core";
import { TLifter } from "../../types";

type Props = {
  id: number;
  lifter: TLifter;
  lifters: TLifter[];
  setLifters: Dispatch<SetStateAction<TLifter[]>>;
  gender: string;
};

export const Lifter = ({ id, lifter, lifters, setLifters, gender }: Props) => {
  const setLifter = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      attribute: "squat" | "bench" | "deadlift" | "name" | "weight"
    ) => {
      const newLifters = lifters.map((curLifter) => {
        if (curLifter.id === id) {
          const tempLifter = curLifter;
          tempLifter[attribute] = event.currentTarget.value;
          return tempLifter;
        }
        return curLifter;
      });
      setLifters(newLifters);
    },
    [lifters, setLifters, id]
  );

  const sortLifterByProperty = useCallback(
    (property: "total" | "points") => {
      const liftersCopy: TLifter[] = structuredClone(lifters);
      liftersCopy.sort((a, b) => {
        if (property === "total") {
          if (a.total === b.total) {
            const a_weight = parseFloat(a.weight || "0");
            const b_weight = parseFloat(b.weight || "0");
            return a_weight - b_weight;
          } else {
            return parseFloat(b.total || "0") - parseFloat(a.total || "0");
          }
        } else {
          return parseFloat(b.points || "0") - parseFloat(a.points || "0");
        }
      });

      const order: { [key: number]: number } = {};
      liftersCopy.forEach((curLifter, idx) => {
        order[curLifter.id] = idx + 1;
      });

      const p: "Total" | "Points" = property === "total" ? "Total" : "Points";

      setLifters(
        lifters.map((curLifter) => {
          const updatedLifter = curLifter;
          updatedLifter[`posBy${p}`] = order[curLifter.id].toString();
          return updatedLifter;
        })
      );
    },
    [lifters, setLifters]
  );

  useEffect(() => {
    sortLifterByProperty("points");
    sortLifterByProperty("total");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lifter.weight, lifter.total]);

  useEffect(() => {
    setLifters(
      lifters.map((curLifter) => {
        if (curLifter.id === id) {
          const updatedLifter = curLifter;
          const newTotal =
            parseFloat(curLifter.squat || "0") +
            parseFloat(curLifter.bench || "0") +
            parseFloat(curLifter.deadlift || "0");

          updatedLifter.total = newTotal.toString();

          const A = gender === "MALE" ? 1199.72839 : 610.32796;
          const B = gender === "MALE" ? 1025.18162 : 1045.59282;
          const C = gender === "MALE" ? 0.00921 : 0.03048;

          if (curLifter.weight && curLifter.weight !== "0") {
            const calcPoints =
              newTotal *
              (100 / (A - B * Math.exp(-C * parseFloat(curLifter.weight))));
            updatedLifter.points = calcPoints.toFixed(2);
          } else {
            updatedLifter.points = "0";
          }

          return updatedLifter;
        }
        return curLifter;
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lifter.squat, lifter.bench, lifter.deadlift, lifter.weight]);

  return (
    <Card mt="lg" p="lg" radius="md" withBorder>
      <Grid>
        <Grid.Col md={3} span={6}>
          <TextInput
            placeholder="Athlete"
            label="Athlete 🏋️‍♂️"
            variant="filled"
            value={lifter.name}
            onChange={(e) => setLifter(e, "name")}
          />
        </Grid.Col>
        <Grid.Col md={3} span={6}>
          <TextInput
            placeholder="Weight"
            label="Weight (kg) ⚖️"
            type="number"
            value={lifter.weight === "0" ? "" : lifter.weight}
            onChange={(e) => setLifter(e, "weight")}
          />
        </Grid.Col>
        <Grid.Col md={3} span={6}>
          <InputBase
            label="Rank (total) 🏅"
            variant="unstyled"
            component="button"
          >
            {lifter.posByTotal === "1"
              ? "🥇"
              : lifter.posByTotal === "2"
              ? "🥈"
              : lifter.posByTotal === "3"
              ? "🥉"
              : `${lifter.posByTotal}°`}
          </InputBase>
        </Grid.Col>
        <Grid.Col md={3} span={6}>
          <InputBase
            label="Rank (points) 🪙"
            variant="unstyled"
            component="button"
          >
            {lifter.posByPoints === "1"
              ? "🥇"
              : lifter.posByPoints === "2"
              ? "🥈"
              : lifter.posByPoints === "3"
              ? "🥉"
              : `${lifter.posByPoints}°`}
          </InputBase>
        </Grid.Col>
        <Grid.Col md={2} span={4}>
          <TextInput
            placeholder="-"
            label="Squat"
            type="number"
            value={lifter.squat === "0" ? "" : lifter.squat}
            onChange={(e) => setLifter(e, "squat")}
          />
        </Grid.Col>
        <Grid.Col md={2} span={4}>
          <TextInput
            placeholder="-"
            label="Bench"
            type="number"
            value={lifter.bench === "0" ? "" : lifter.bench}
            onChange={(e) => setLifter(e, "bench")}
          />
        </Grid.Col>
        <Grid.Col md={2} span={4}>
          <TextInput
            placeholder="-"
            label="Deadlift"
            type="number"
            value={lifter.deadlift === "0" ? "" : lifter.deadlift}
            onChange={(e) => setLifter(e, "deadlift")}
          />
        </Grid.Col>
        <Grid.Col md={3} span={6}>
          <InputBase
            label="Total (kg) 🏹"
            variant="unstyled"
            component="button"
          >
            {lifter.total}
          </InputBase>
        </Grid.Col>
        <Grid.Col md={3} span={6}>
          <InputBase
            label="IPF Points 🎯"
            variant="unstyled"
            component="button"
          >
            {lifter.points}
          </InputBase>
        </Grid.Col>
      </Grid>
    </Card>
  );
};
// export const hola = 2;

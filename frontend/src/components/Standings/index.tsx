import { Table } from "@mantine/core";
import { useEffect, useState } from "react";
import { TLifter } from "../../types";

type Props = {
  lifters: TLifter[];
};

export const Standings = ({ lifters }: Props) => {
  const [sortedLifters, setSortedLifters] = useState<TLifter[]>(null!);

  useEffect(() => {
    console.log("hola");
    const sorted = lifters.slice().sort((a, b) => {
      return parseInt(b.total || "0") - parseInt(a.total || "0");
    });
    setSortedLifters(sorted);
  }, [lifters]);

  return (
    <Table striped>
      <thead>
        <tr>
          <th>Name</th>
          <th>SQ</th>
          <th>BP</th>
          <th>DL</th>
          <th>Total</th>
          <th>To tie 🥇</th>
          <th>To tie🥈</th>
          <th>To tie 🥉</th>
          <th>To tie next lifter</th>
        </tr>
      </thead>
      <tbody>
        {sortedLifters &&
          sortedLifters.map((lifter, index) => (
            <tr key={lifter.id}>
              <td>{lifter.name}</td>
              <td>{lifter.squat}</td>
              <td>{lifter.bench}</td>
              <td>{lifter.deadlift}</td>
              <td>{lifter.total}</td>
              <td>
                {index === 0
                  ? "-"
                  : parseInt(sortedLifters[0].total || "0") -
                    parseInt(lifter.total || "0")}
              </td>
              <td>
                {index <= 1
                  ? "-"
                  : parseInt(sortedLifters[1].total || "0") -
                    parseInt(lifter.total || "0")}
              </td>
              <td>
                {index <= 2
                  ? "-"
                  : parseInt(sortedLifters[2].total || "0") -
                    parseInt(lifter.total || "0")}
              </td>
              <td>
                {index === 0
                  ? "0"
                  : parseInt(sortedLifters[index - 1].total || "0") -
                    parseInt(lifter.total || "0")}
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
};

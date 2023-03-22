import { Breadcrumbs, createStyles } from "@mantine/core";
import { Link } from "react-router-dom";

type Props = {
  breadcrumbs: {
    link: string;
    title: string;
  }[];
};

const useStyles = createStyles(() => ({
  link: {
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
      cursor: "pointer",
    },
    color: "#1c7ed6",
    fontSize: "24px",
    fontWeight: 400,

    "@media (max-width: 800px)": {
      fontSize: "16px",
    },
  },
}));

export const AppBreadcrumbs = ({ breadcrumbs }: Props) => {
  const { classes } = useStyles();
  return (
    <Breadcrumbs mb="xl" separator="→">
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <Link to={breadcrumb.link} className={classes.link} key={index}>
            {breadcrumb.title}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

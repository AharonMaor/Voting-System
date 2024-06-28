import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

export default function Voter({name}) {
    return (
        <Card sx={{ maxWidth: 345, minWidth: 300 }}>
          <CardHeader
            title={
              <Typography align="center" variant="subtitle1">
                {name}
              </Typography>
            }
          />
        </Card>
      );
};

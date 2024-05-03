import * as React from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import Link from "next/link";

interface Donor {
  donorid: number;
  donorname: string;
  dateofbirth: string;
  bloodgroup: string;
  location: string;
  disease?: string;
  contact: string;
}

interface IntroDividerProps {
  donor: Donor | null; // Adjust the prop type to accept a single donor or null
}

export default function IntroDivider({ donor }: IntroDividerProps) {
  // Check if donor is null or undefined
  if (!donor) {
    return null; // Return null if donor is null or undefined
  }

  // Render the donor information
  return (
    <Card variant="outlined" sx={{ maxWidth: 1000 }}>
      <Box sx={{ p: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography gutterBottom variant="h5" component="div">
            {donor.donorname}
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            {donor.bloodgroup}
          </Typography>
        </Stack>
        <Typography color="text.secondary" variant="body2">
          Pinstriped cornflower blue cotton blouse takes you on a walk to the
          park or just down the hall. 
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography gutterBottom variant="body2">
          <Link href={`/donors/${donor.donorid}`}>
            <Button>View Details</Button>
          </Link>
        </Typography>
        {/* <Stack direction="row" spacing={1}>
          <Chip color="primary" label="Soft" size="small" />
          <Chip label="Medium" size="small" />
          <Chip label="Hard" size="small" />
        </Stack> */}
      </Box>
    </Card>
  );
}

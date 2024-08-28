import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Button } from "@mui/material";
import { useParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";

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

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function RecipeReviewCard({ donor }: IntroDividerProps) {
  const [expanded, setExpanded] = React.useState(false);
  const params = useParams();
  const router = useRouter();
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleDelete = async (donorId: string): Promise<void> => {
    try {
      const donorId = params.donorid;
      const response = await axios.delete(
        `http://localhost:3000/donors/${donorId}`
      );

      if (response.status === 200) {
        router.push("/donors");
        // Handle successful deletion (e.g., update UI, show success message)
      } else {
        console.error("Failed to delete donor:", response);
        // Handle deletion failure (e.g., display error message to user)
      }
    } catch (error) {
      console.error("Error deleting donor:", error);
      // Handle errors (e.g., network issues, server errors)
    }
  };

  if (!donor) {
    return null; // Return null if donor is null or undefined
  }

  return (
    <Card sx={{ minWidth: 800, maxWidth: 700 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe"></Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={donor[0].donorname}
        subheader={donor[0].location}
      />
      {/* <CardMedia
        component="img"
        height="194"
        image="/static/images/cards/paella.jpg"
        alt="Paella dish"
      /> */}
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {donor[0].donorname}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Donor Details</Typography>
          <Typography paragraph>Blood Group: {donor[0].bloodgroup}</Typography>
          <Typography paragraph>Location: {donor[0].location}</Typography>
          {/* <Typography paragraph>
            Add rice and stir very gently to distribute. Top with artichokes and
            peppers, and cook without stirring, until most of the liquid is
            absorbed, 15 to 18 minutes. Reduce heat to medium-low, add reserved
            shrimp and mussels, tucking them down into the rice, and cook again
            without stirring, until mussels have opened and rice is just tender,
            5 to 7 minutes more. (Discard any mussels that don&apos;t open.)
          </Typography> */}
          {/* <Typography>
            Set aside off of the heat to let rest for 10 minutes, and then
            serve.
          </Typography> */}
        </CardContent>
      </Collapse>
      <Button href={`/donors/${donor[0].donorid}/edit`} variant="contained">
        Edit
      </Button>
      &nbsp;&nbsp;
      <Button color="error" variant="contained" onClick={handleDelete}>
        Delete
      </Button>
    </Card>
  );
}

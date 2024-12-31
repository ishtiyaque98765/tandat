import React, { useEffect, useState } from "react";
import axios from "../utility/axiosUtils";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";

function InterviewListing() {
  const [interviews, setInterviews] = useState([]);

  const getInterviewsList = async () => {
    try {
      console.log("Calling API...");
      const listingBody = {
        pageIndex: 0,
        pageSize: 9,
        searchValue: "",
        sortActive: "name",
        sortOrder: "asc",
      };
      const request = await axios.post("/interview/list", listingBody);
      const data = request.data.data; // Extract the `data` array from the response
      console.log("API Response:", data);

      // Map over the array to extract the required properties
      const interviewDetails = data.map((item) => ({
        id: item._id || "id not found", // Unique identifier for the interview
        title: item.title || "title not found", // Title of the interview
        aboutMe: item.aboutMe || "aboutMe not found", // About the expert
        imageURL: item.imageURL || "https://via.placeholder.com/150", // Fallback image
      }));

      console.log("Interview Details:", interviewDetails);
      setInterviews(interviewDetails);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    }
  };

  useEffect(() => {
    getInterviewsList();
  }, []);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" align="center" gutterBottom>
        Interview Listing
      </Typography>
      <Grid container spacing={3} style={{ display: "flex" }}>
        {interviews.map((interview) => {
          console.log("Image URL:", interview.imageURL); // Debugging
          return (
            <Grid item key={interview.id} xs={12} sm={6} md={4}>
              <Card style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={interview.imageURL}
                  alt={interview.title}
                />
                <CardContent style={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {interview.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {interview.aboutMe}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}

export default InterviewListing;
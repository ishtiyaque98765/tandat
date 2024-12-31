import React, { useEffect, useState } from "react";
import axios from "../utility/axiosUtils";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";

function CourseListing() {
  const [courses, setCourses] = useState([]); // State to store the course list
  const [selectedCourseId, setSelectedCourseId] = useState(null); // State to store the selected course ID
  const [selectedCourseDetails, setSelectedCourseDetails] = useState(null); // State to store the selected course details

  // Function to fetch course details for a single course
  const fetchCourseDetails = async (courseId) => {
    try {
      const listingBody = {
        pageIndex: 0,
        pageSize: 1,
        searchValue: courseId, // Pass the course ID to fetch details
        sortActive: "title",
        sortOrder: "asc",
      };
      const request = await axios.post("/course/details", listingBody);
      const data = request.data.data;

      // Log the API response for debugging
      console.log("API Response for Course Details:", data);

      // Check if the course details are found
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Course details not found");
      }

      // Extract details from the API response
      const courseDetails = data[0];
      return {
        id: courseDetails._id || "id not found",
        title: courseDetails.title || "title not found",
        description: courseDetails.description || "description not found",
        banner: courseDetails.banner || "banner not found",
        duration: courseDetails.duration || "duration not found", // Extract duration
        instructor: courseDetails.instructor || "instructor not found", // Extract instructor
      };
    } catch (error) {
      console.log("Error fetching course details:", error);
      return null; // Return null if course details are not found
    }
  };

  // Function to fetch the course list and integrate details
  const getCourseList = async () => {
    try {
      console.log("Calling");
      const listingBody = {
        pageIndex: 0,
        pageSize: 9,
        searchValue: "",
        sortActive: "name",
        sortOrder: "asc",
      };
      const request = await axios.post("/course/list", listingBody);
      const data = request.data.data;

      // Log the API response for debugging
      console.log("API Response for Course List:", data);

      if (!Array.isArray(data)) {
        throw new Error("data is not array");
      }

      // Fetch details for each course
      const coursesWithDetails = await Promise.all(
        data.map(async (course) => {
          const details = await fetchCourseDetails(course._id);

          // Log the details for debugging
          console.log(`Details for Course ID ${course._id}:`, details);

          // Merge course details with the course object
          return {
            ...course, // Include all existing course fields
            details: details || {}, // Add course details (or an empty object if null)
          };
        })
      );

      setCourses(coursesWithDetails); // Set the courses state with details
    } catch (error) {
      console.log("Error", error);
    }
  };

  // Handle "Learn More" button click
  const handleLearnMore = async (courseId) => {
    setSelectedCourseId(courseId); // Set the selected course ID

    // Fetch the details for the selected course
    const details = await fetchCourseDetails(courseId);
    setSelectedCourseDetails(details); // Store the details in the state
  };

  // Close the additional information section
  const handleCloseDetails = () => {
    setSelectedCourseId(null); // Clear the selected course ID
    setSelectedCourseDetails(null); // Clear the selected course details
  };

  useEffect(() => {
    getCourseList();
  }, []);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" align="center" gutterBottom>
        Course Listing
      </Typography>
      <Grid container spacing={3} style={{ display: "flex" }}>
        {courses.map((course) => (
          <Grid item key={course._id} xs={12} sm={6} md={4}>
            <Card style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <CardMedia
                component="img"
                height="140"
                image={course.banner || "banner not found"} // Use course.banner directly
                alt={course.title}
              />
              <CardContent style={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {course.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleLearnMore(course._id)}>
                  Learn More
                </Button>
              </CardActions>

              {/* Additional Information Section */}
              {selectedCourseId === course._id && (
                <div style={{ padding: "16px", borderTop: "1px solid #ccc" }}>
                  <Typography variant="h6" gutterBottom>
                    Additional Information
                  </Typography>
                  {selectedCourseDetails ? (
                    <>
                      <Typography variant="body1">
                        Duration: {selectedCourseDetails.duration || "duration not found"}
                      </Typography>
                      <Typography variant="body1">
                        Instructor: {selectedCourseDetails.instructor || "instructor not found"}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body1" color="error">
                      Course details not found.
                    </Typography>
                  )}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleCloseDetails}
                    style={{ marginTop: "16px" }}
                  >
                    Close Details
                  </Button>
                </div>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default CourseListing;
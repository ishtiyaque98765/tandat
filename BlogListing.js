import React, { useEffect, useState } from "react";
import axios from "../utility/axiosUtils";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Link,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

function BlogListing() {
  const [blogs, setBlogs] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true); // Add a loading state

  const getBlogsList = async () => {
    try {
      console.log("Calling API...");
      const listingBody = {
        pageIndex: 0,
        pageSize: 9,
        searchValue: "",
        sortActive: "name",
        sortOrder: "asc",
      };

      // Make the POST request
      const response = await axios.post("/blog/list", listingBody);

      // Log the entire response to inspect its structure
      console.log("API Response:", response.data);

      // Parse the JSON response
      const data = response.data.data; // Access the `data` array from the response

      // Check if the data is valid and is an array
      if (!Array.isArray(data)) {
        throw new Error("Invalid API response: Expected an array of blogs.");
      }

      // Extract blogs from the array
      const blogs = data.map((blog) => ({
        id: blog._id, // Use _id as the unique key
        title: blog.title || "No Title", // Default to "No Title" if title is missing
        content: blog.content || "No Content", // Default to "No Content" if content is missing
        description: blog.description || "No Description", // Default to "No Description" if description is missing
        banner: blog.banner || "https://example.com/default-banner.jpg", // Default to a placeholder banner if missing
        attachments: blog.attachment || [], // Default to an empty array if attachments are missing
        videoLink: blog.videoLink || "No Video Link", // Default to "No Video Link" if videoLink is missing
        name: `${blog.userFirstName} ${blog.userLastName}`, // Combine firstName and lastName
      }));

      // Update the state with the formatted blogs
      setBlogs(blogs);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setLoading(false); // Set loading to false even if there's an error
    }
  };

  useEffect(() => {
    getBlogsList();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while data is being fetched
  }

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Blog Listing
      </Typography>
      <Grid container spacing={3} style={{ display: "flex" }}>
        {blogs.map((blog) => (
          <Grid item key={blog.id} xs={12} sm={6} md={4}>
            <Card style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <CardMedia
                component="img"
                height="140"
                image={blog.banner}
                alt={blog.title}
              />
              <CardContent style={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2">
                  {blog.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {blog.description}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {blog.content}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  <strong>Author:</strong> {blog.name}
                </Typography>

                {/* Display Video Link */}
                <Typography variant="body2" color="textSecondary" component="p">
                  <strong>Video:</strong>{" "}
                  <Link href={blog.videoLink} target="_blank" rel="noopener noreferrer">
                    Watch Video
                  </Link>
                </Typography>

                {/* Display Attachments */}
                {blog.attachments.length > 0 && (
                  <div>
                    <Typography variant="body2" color="textSecondary" component="p">
                      <strong>Attachments:</strong>
                    </Typography>
                    <List dense>
                      {blog.attachments.map((attachment, index) => (
                        <ListItem key={index}>
                          <ListItemText>
                            <Link href={attachment} target="_blank" rel="noopener noreferrer">
                              Attachment {index + 1}
                            </Link>
                          </ListItemText>
                        </ListItem>
                      ))}
                    </List>
                  </div>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default BlogListing;
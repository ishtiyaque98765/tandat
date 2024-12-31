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

function MenuListings() {
  const [menus, setMenus] = useState([]);

  const getMenusList = async () => {
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
      const response = await axios.post("/category/menu", listingBody);

      // Log the entire response to inspect its structure
      console.log("API Response:", response.data);

      // Parse the JSON response
      const data = response.data.data; // Access the `data` array from the response

      // Check if the data is valid and is an array
      if (!Array.isArray(data)) {
        throw new Error("Invalid API response: Expected an array of menus.");
      }

      // Extract menus from the array
      const menus = data.map((menu) => ({
        id: menu._id, // Use _id as the unique key
        name: menu.name || "No Name", // Default to "No Name" if name is missing
        description: menu.description || "No Description", // Default to "No Description" if description is missing
        image: menu.image || "https://via.placeholder.com/150", // Default to a placeholder image if missing
      }));

      // Debugging: Log each menu's image URL
      menus.forEach((menu) => {
        console.log(`Menu ID: ${menu.id}, Image URL: ${menu.image}`);
      });

      // Update the state with the formatted menus
      setMenus(menus);
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };

  useEffect(() => {
    getMenusList();
  }, []);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" align="center" gutterBottom>
        Menu List
      </Typography>
      <Grid container spacing={3} style={{ display: "flex" }}>
        {menus.map((menu) => (
          <Grid item key={menu.id} xs={12} sm={6} md={4}>
            <Card style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <CardMedia
                component="img"
                height="140"
                image={menu.image} // Use menu.image directly
                alt={menu.name}
                onError={(e) => {
                  console.error(`Error loading image for menu ID: ${menu.id}`);
                  e.target.onerror = null; // Prevent infinite loop on error
                  e.target.src = "https://via.placeholder.com/150"; // Fallback image
                }}
              />
              <CardContent style={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {menu.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {menu.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default MenuListings;
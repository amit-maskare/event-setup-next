"use client"

import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, Grid, Box, CircularProgress } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import LocalActivity from '@mui/icons-material/LocalActivity';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import FmdGood from '@mui/icons-material/FmdGood';
import EventDialog from "./components/EventDialog";


const EventsPage = () => {
  const [loading, setLoading] = useState(false);
  const [eventList, setEventList] = useState<EventList[]>([]);
  const [open, setOpen] = useState(false);

  const getEvents = async () => {
    setLoading(true);
    try {
      const list = await axios.get(`${process.env.NEXT_PUBLIC_ENDPOINT}/events`);
      setEventList(list?.data || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error to fetch list of events.");
    } finally {
      setLoading(false);
    }
  }

  const removeEvent = async (eventId: string) => {
    setLoading(true);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_ENDPOINT}/event/${eventId}`);
      setEventList((pre: EventList[]) => (pre.filter(d => d.id !== eventId)));
      toast.success("Event removed successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error in remove event.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getEvents();
  }, [])

  return (
    <div style={{ padding: "20px" }}>
      <EventDialog open={open} setOpen={setOpen} setLoading={setLoading} setEvent={setEventList} />
      <Typography variant="h4" gutterBottom align="center">
        Events
      </Typography>

      <Box position="absolute" top={16} right={16}>
        <Button onClick={() => setOpen(true)} variant="contained" color="primary">
          New Event
        </Button>
      </Box>
      {loading && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgcolor="rgba(0, 0, 0, 0.5)"
          display="flex"
          justifyContent="center"
          alignItems="center"
          zIndex={1000}
        >
          <CircularProgress />
        </Box>
      )}
      <Grid container spacing={3}>
        {eventList.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                  <LocalActivity style={{ color: 'green' }} />
                  <Typography variant="h5" component="div">
                    {event.title}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <CalendarMonth style={{ color: 'green' }} />
                  <Typography color="text.secondary">{event.date}</Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <FmdGood style={{ color: 'green' }} />
                  <Typography color="text.secondary">Location: {event.location}</Typography>
                </Box>
                <Button onClick={() => removeEvent(event.id)} variant="contained" color="error" sx={{ marginTop: 2 }}>
                  Remove Event
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default EventsPage;

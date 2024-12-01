"use client"

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import axios, { AxiosResponse } from "axios";
import React, { memo, useState } from "react";
import { toast } from "react-toastify";

interface Props {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setEvent: React.Dispatch<React.SetStateAction<EventList[]>>;
}

const EventDialog = ({ open, setOpen, setLoading, setEvent }: Props) => {
    const [newEvent, setNewEvent] = useState({
        title: "",
        date: "",
        location: "",
    });

    const [errors, setErrors] = useState({
        title: "",
        date: "",
        location: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewEvent((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        let hasErrors = false;
        const newErrors = { title: "", date: "", location: "" };

        // Validation for required fields
        if (!newEvent.title) {
            newErrors.title = "Title is required.";
            hasErrors = true;
        }
        if (!newEvent.date) {
            newErrors.date = "Date is required.";
            hasErrors = true;
        }
        if (!newEvent.location) {
            newErrors.location = "Location is required.";
            hasErrors = true;
        }

        if (hasErrors) {
            setErrors(newErrors);
            return;
        }
        setErrors(newErrors);

        setLoading(true);
        try {
            const response: AxiosResponse<EventList> = await axios.post(`${process.env.NEXT_PUBLIC_ENDPOINT}/event`, newEvent);
            setEvent((prevState: EventList[]) => [...prevState, response?.data as EventList]);
            toast.success("Event created successfully!");
        } catch (error: any) {
            toast.error(`${error?.response?.data?.message || "Error in creating event."}`);
        } finally {
            setNewEvent({
                title: "",
                date: "",
                location: "",
            });
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <div>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle align="center">Create New Event</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Event Title"
                        fullWidth
                        variant="outlined"
                        name="title"
                        value={newEvent.title}
                        onChange={handleInputChange}
                        error={!!errors.title}
                        helperText={errors.title}
                    />
                    <TextField
                        margin="dense"
                        label="Event Date"
                        fullWidth
                        variant="outlined"
                        name="date"
                        type="date"
                        value={newEvent.date}
                        onChange={handleInputChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        error={!!errors.date}
                        helperText={errors.date}
                    />
                    <TextField
                        margin="dense"
                        label="Event Location"
                        fullWidth
                        variant="outlined"
                        name="location"
                        value={newEvent.location}
                        onChange={handleInputChange}
                        error={!!errors.location}
                        helperText={errors.location}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

const EventDialogMemo = memo(EventDialog);
export default EventDialogMemo;
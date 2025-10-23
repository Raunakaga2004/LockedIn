"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";

type TaskType = "quick_task" | "daily" | "monthly" | "yearly";

type AddTaskWindowProps = {
  open: boolean;
  onClose: () => void;
  onSave: (taskData: any) => void;
};

export default function AddTaskWindow({ open, onClose, onSave }: AddTaskWindowProps) {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    type: "quick_task" as TaskType,
    status: "uncompleted",
    urgent: false,
    important: false,
    expected_pomodoro: "",
    actual_pomodoro: "",
    tags: "",
    recurrence_id: "",
  });

  const handleChange = (field: string, value: any) => {
    setTaskData({ ...taskData, [field]: value });
  };

  const handleSave = () => {
    onSave(taskData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Add New Task
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Task Name */}
        <TextField
          fullWidth
          label="Task Name"
          variant="outlined"
          value={taskData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Expected and Actual Pomodoro */}
        <Box display="flex" gap={2} mb={2}>
          <TextField
            label="Expected Pomodoro"
            type="number"
            fullWidth
            value={taskData.expected_pomodoro}
            onChange={(e) => handleChange("expected_pomodoro", e.target.value)}
          />
          <TextField
            label="Actual Pomodoro"
            type="number"
            fullWidth
            value={taskData.actual_pomodoro}
            onChange={(e) => handleChange("actual_pomodoro", e.target.value)}
          />
        </Box>

        {/* Description */}
        <TextField
          fullWidth
          label="Description"
          multiline
          rows={3}
          variant="outlined"
          value={taskData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Tags */}
        <TextField
          fullWidth
          label="Tags"
          placeholder="Comma separated tags"
          value={taskData.tags}
          onChange={(e) => handleChange("tags", e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Type Dropdown */}
        <TextField
          select
          label="Task Type"
          fullWidth
          value={taskData.type}
          onChange={(e) => handleChange("type", e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="quick_task">Quick Task</MenuItem>
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="yearly">Yearly</MenuItem>
        </TextField>

        {/* Urgent / Important */}
        <Box display="flex" gap={2} mb={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={taskData.urgent}
                onChange={(e) => handleChange("urgent", e.target.checked)}
              />
            }
            label="Urgent"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={taskData.important}
                onChange={(e) => handleChange("important", e.target.checked)}
              />
            }
            label="Important"
          />
        </Box>

        {/* Add Recurrence */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body1">Recurrence</Typography>
          <IconButton color="primary">
            <Add />
          </IconButton>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="error" variant="outlined">
          Close
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

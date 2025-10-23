"use client";
import React, { useState, useEffect } from "react";
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
import { Close } from "@mui/icons-material";

type TaskType = "quick_task" | "daily" | "monthly" | "yearly";

type TaskReference = {
  id?: string;
  title: string;
  description?: string;
  type?: TaskType | string; // fix it later (it should not be string)
  status: string;
  urgent?: boolean;
  important?: boolean;
  recurrence_id?: string;
  expected_pomodoro?: number;
  actual_pomodoro?: number;
  tags?: string;
};

type EditTaskWindowProps = {
  open: boolean;
  task: TaskReference | null;
  onClose: () => void;
  onSave: (updatedTask: TaskReference) => void;
};

export default function EditTaskWindow({ open, task, onClose, onSave }: EditTaskWindowProps) {
  const [formData, setFormData] = useState<TaskReference | null>(null);

  useEffect(() => {
    if (task) {
      setFormData(task);
    }
  }, [task]);

  if (!formData) return null;

  const handleChange = (field: keyof TaskReference, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Edit Task
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
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Expected and Actual Pomodoro */}
        <Box display="flex" gap={2} mb={2}>
          <TextField
            label="Expected Pomodoro"
            type="number"
            fullWidth
            value={formData.expected_pomodoro || ""}
            onChange={(e) => handleChange("expected_pomodoro", Number(e.target.value))}
          />
          <TextField
            label="Actual Pomodoro"
            type="number"
            fullWidth
            value={formData.actual_pomodoro || ""}
            onChange={(e) => handleChange("actual_pomodoro", Number(e.target.value))}
          />
        </Box>

        {/* Description */}
        <TextField
          fullWidth
          label="Description"
          multiline
          rows={3}
          variant="outlined"
          value={formData.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Tags */}
        <TextField
          fullWidth
          label="Tags"
          placeholder="Comma separated tags"
          value={formData.tags || ""}
          onChange={(e) => handleChange("tags", e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Type Dropdown */}
        <TextField
          select
          label="Task Type"
          fullWidth
          value={formData.type}
          onChange={(e) => handleChange("type", e.target.value as TaskType)}
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
                checked={formData.urgent || false}
                onChange={(e) => handleChange("urgent", e.target.checked)}
              />
            }
            label="Urgent"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.important || false}
                onChange={(e) => handleChange("important", e.target.checked)}
              />
            }
            label="Important"
          />
        </Box>

        {/* Recurrence */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body1">Recurrence</Typography>
          <Button
            color="primary"
            onClick={() => {}}
          >
            Edit Recurrence
          </Button>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="error" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

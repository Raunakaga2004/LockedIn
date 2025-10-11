import * as React from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Container,
  Grid,
  Paper,
  Stack,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

export default function LandingPage() {
  const [mode, setMode] = React.useState<"light" | "dark">("light");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: mode === "light" ? "#1976d2" : "#90caf9" },
          secondary: { main: mode === "light" ? "#9c27b0" : "#ce93d8" },
          background: {
            default: mode === "light" ? "#fff" : "#121212",
            paper: mode === "light" ? "#fff" : "#1e1e1e",
          },
        },
        typography: {
          fontFamily: `'Roboto', 'Helvetica', 'Arial', sans-serif`,
          h2: { fontWeight: 700 },
          h5: { fontWeight: 500 },
        },
      }),
    [mode]
  );

  const features = [
    {
      title: "Pomodoro Timer",
      desc: "Stay focused with customizable sessions to maximize productivity.",
    },
    {
      title: "Habit Tracker",
      desc: "Build consistent habits with daily, weekly, and monthly tracking.",
    },
    {
      title: "Reports & Insights",
      desc: "Visualize your performance and see your productivity trends.",
    },
  ];

  const benefits = [
    {
      title: "Boost Focus",
      desc: "Eliminate distractions and stay locked in on your tasks.",
    },
    {
      title: "Improve Consistency",
      desc: "Track progress and maintain daily routines effortlessly.",
    },
    {
      title: "Increase Productivity",
      desc: "Use data-driven insights to optimize your workflow.",
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Navbar */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: 700, color: "primary.main" }}
          >
            Locked In
          </Typography>
          <IconButton
            sx={{ ml: 1 }}
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
            color="inherit"
          >
            {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <Button variant="contained" sx={{ ml: 2 }}>
            Sign In
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          minHeight: "80vh",
          py: 6,
        }}
      >
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" gutterBottom>
                Focus Better, Achieve More
              </Typography>
              <Typography variant="h5" color="text.secondary" paragraph>
                A productivity suite designed to help you stay locked in — manage
                your tasks, track your focus, and level up your habits.
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{ mt: 2, borderRadius: 2 }}
              >
                Get Started
              </Button>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://mui.com/static/images/material-ui/hero-light.png"
                alt="Landing visual"
                sx={{ width: "100%", borderRadius: 3, boxShadow: 3 }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="features" sx={{ bgcolor: mode === "light" ? "#f9fafb" : "#1e1e1e", py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" gutterBottom>
            Features
          </Typography>
          <Grid container spacing={4}>
            {features.map((f, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Paper
                  elevation={2}
                  sx={{ p: 4, textAlign: "center", borderRadius: 3, height: "100%" }}
                >
                  <Typography variant="h6" gutterBottom>
                    {f.title}
                  </Typography>
                  <Typography color="text.secondary">{f.desc}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits / How it Can Help Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" gutterBottom>
            How It Can Help
          </Typography>
          <Grid container spacing={4}>
            {benefits.map((b, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Paper
                  elevation={2}
                  sx={{ p: 4, textAlign: "center", borderRadius: 3, height: "100%" }}
                >
                  <Typography variant="h6" gutterBottom>
                    {b.title}
                  </Typography>
                  <Typography color="text.secondary">{b.desc}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 10, textAlign: "center", bgcolor: mode === "light" ? "#f5f5f5" : "#121212" }}>
        <Container maxWidth="sm">
          <Typography variant="h4" gutterBottom>
            Start Your Productivity Journey
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Join thousands improving their focus and building habits every day.
          </Typography>
          <Button variant="contained" size="large">
            Create Account
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, textAlign: "center", bgcolor: mode === "light" ? "#f1f1f1" : "#1e1e1e" }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Locked In. All rights reserved.
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

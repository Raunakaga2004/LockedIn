import { Container, Typography } from "@mui/material";

export default function Dashboard() {
  return (
    <Container sx={{ py: 10 }}>
      <Typography variant="h4">Welcome back 👋</Typography>
      <Typography color="text.secondary">
        Here’s your personalized productivity dashboard.
      </Typography>
    </Container>
  );
}
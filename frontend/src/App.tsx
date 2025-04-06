import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Grid,
  Paper,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  CircularProgress,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Lightbulb, TrendingUp, Warning } from '@mui/icons-material';

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#4caf50',
    },
    background: {
      default: '#0a1929',
      paper: '#1e2a3a',
    },
  },
});

interface EnergyData {
  timestamp: string;
  total_load: number;
  renewable_generation: {
    solar: number;
    wind: number;
  };
  grid_stability: number;
}

interface EnergyAudit {
  total_consumption_24h: number;
  peak_demand: number;
  renewable_percentage: number;
  efficiency_score: number;
  optimization_suggestions: string[];
}

function App() {
  const [liveData, setLiveData] = useState<EnergyData[]>([]);
  const [currentStatus, setCurrentStatus] = useState<EnergyData | null>(null);
  const [auditData, setAuditData] = useState<EnergyAudit | null>(null);

  useEffect(() => {
    // WebSocket connection for live data
    const ws = new WebSocket('ws://localhost:8000/ws/live-data');
    
    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setCurrentStatus(newData);
      setLiveData(prev => [...prev.slice(-20), newData]);
    };

    // Fetch energy audit data
    const fetchAuditData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/energy-audit');
        const data = await response.json();
        setAuditData(data);
      } catch (error) {
        console.error('Error fetching audit data:', error);
      }
    };

    fetchAuditData();
    const auditInterval = setInterval(fetchAuditData, 60000); // Update audit data every minute

    return () => {
      ws.close();
      clearInterval(auditInterval);
    };
  }, []);

  const COLORS = ['#00C49F', '#FF8042'];

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Smart Grid Optimizer
            </Typography>
            {currentStatus && (
              <Chip
                label={`Grid Stability: ${(currentStatus.grid_stability * 100).toFixed(1)}%`}
                color={currentStatus.grid_stability > 0.9 ? "success" : "warning"}
                sx={{ mr: 2 }}
              />
            )}
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Live Energy Consumption */}
            <Grid item xs={12} lg={8}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Live Energy Consumption
                </Typography>
                <ResponsiveContainer>
                  <LineChart data={liveData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp"
                      tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                    />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone"
                      dataKey="total_load"
                      stroke="#8884d8"
                      name="Total Load (kW)"
                    />
                    <Line 
                      type="monotone"
                      dataKey="renewable_generation.solar"
                      stroke="#82ca9d"
                      name="Solar Generation (kW)"
                    />
                    <Line 
                      type="monotone"
                      dataKey="renewable_generation.wind"
                      stroke="#ffc658"
                      name="Wind Generation (kW)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Current Status */}
            <Grid item xs={12} lg={4}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Current Status
                </Typography>
                {currentStatus ? (
                  <>
                    <Typography variant="body1" gutterBottom>
                      Total Load: {currentStatus.total_load.toFixed(2)} kW
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Solar Generation: {currentStatus.renewable_generation.solar.toFixed(2)} kW
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Wind Generation: {currentStatus.renewable_generation.wind.toFixed(2)} kW
                    </Typography>
                    <Box sx={{ height: 200, mt: 2 }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Renewable', value: currentStatus.renewable_generation.solar + currentStatus.renewable_generation.wind },
                              { name: 'Non-Renewable', value: Math.max(0, currentStatus.total_load - (currentStatus.renewable_generation.solar + currentStatus.renewable_generation.wind)) }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {COLORS.map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                    <Typography variant="caption" align="center">
                      Energy Source Distribution
                    </Typography>
                  </>
                ) : (
                  <CircularProgress />
                )}
              </Paper>
            </Grid>

            {/* Energy Audit */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Energy Audit
                </Typography>
                {auditData ? (
                  <>
                    <Typography variant="body1" gutterBottom>
                      24h Consumption: {auditData.total_consumption_24h.toFixed(2)} kWh
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Peak Demand: {auditData.peak_demand.toFixed(2)} kW
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Renewable Energy: {auditData.renewable_percentage.toFixed(1)}%
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Efficiency Score: {(auditData.efficiency_score * 100).toFixed(1)}%
                    </Typography>
                  </>
                ) : (
                  <CircularProgress />
                )}
              </Paper>
            </Grid>

            {/* AI Optimization Suggestions */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  AI Optimization Suggestions
                </Typography>
                {auditData ? (
                  <List>
                    {auditData.optimization_suggestions.map((suggestion, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          {index === 0 ? <Lightbulb color="primary" /> :
                           index === 1 ? <TrendingUp color="secondary" /> :
                           <Warning color="warning" />}
                        </ListItemIcon>
                        <ListItemText primary={suggestion} />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <CircularProgress />
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App; 
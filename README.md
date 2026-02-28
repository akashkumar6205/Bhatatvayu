# Bharatvayu 🌍

A modern, AI-powered Air Quality Index (AQI) Prediction Website that works for any location worldwide.

## 🚀 Features

- **Real-time AQI Monitoring**: Displays current AQI and pollutant levels (PM2.5, PM10, NO2, SO2, CO, O3).
- **AI-Based Prediction**: Uses a simulated LSTM/Time-Series model to forecast AQI for the next 7 days.
- **Health Advisory System**: Generates dynamic, AI-powered health advisories using Google Gemini based on current AQI levels.
- **Interactive Visualizations**: Clean, responsive charts using Recharts.
- **Mobile-First Design**: Fully responsive UI built with Tailwind CSS.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Recharts, Lucide React
- **Backend**: Node.js, Express
- **AI/ML**: Google Gemini API (for Health Advisories), Simulated LSTM for AQI forecasting
- **Deployment**: Vercel/Netlify (Frontend), Render/Railway (Backend)

## 📦 Setup Instructions

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd aeropredict-ai
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Variables**
   Create a \`.env\` file in the root directory and add your Gemini API key:
   \`\`\`env
   GEMINI_API_KEY=your_gemini_api_key_here
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`
   The app will be available at \`http://localhost:3000\`.

## 🧠 ML Model Details (Prototype)

In this prototype, the AQI prediction is simulated to represent an LSTM (Long Short-Term Memory) time-series model. 
In a production environment, the backend would serve predictions from a trained Python model (e.g., using TensorFlow/Keras or PyTorch) via a REST API.

### Features used for training:
- PM2.5, PM10, NO2, SO2, CO, O3
- Temperature, Humidity, Wind Speed
- Historical AQI data

## 🏗️ Architecture Diagram

\`\`\`
[ User Interface (React) ] <---> [ Express.js Backend API ]
                                      |             |
                                      v             v
                           [ Gemini API ]    [ ML Prediction Service ]
                           (Health Advice)   (LSTM AQI Forecast)
\`\`\`

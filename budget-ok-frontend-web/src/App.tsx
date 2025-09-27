import {App as AntdApp} from 'antd';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import './App.css';
import CreateEnvelopeForm from "./components/CreateEnvelopeForm/CreateEnvelopeForm.tsx";
import EnvelopesTable from "./components/EnvelopesTable/EnvelopesTable";

const queryClient = new QueryClient();

function AppContent() {
  return (
      <div className="app-container">
        <h1>Budget OK</h1>
        <div className="card" style={{marginTop: '24px'}}>
          <h2>Your Envelopes</h2>
          <EnvelopesTable/>
        </div>
        <div className="card">
          <h2>Create New Envelope</h2>
          <CreateEnvelopeForm/>
        </div>
      </div>
  );
}

export default function App() {
  return (
      <QueryClientProvider client={queryClient}>
        <AntdApp>
          <AppContent/>
        </AntdApp>
      </QueryClientProvider>
  );
}

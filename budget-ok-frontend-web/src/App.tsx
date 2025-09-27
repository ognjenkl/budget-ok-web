import { App as AntdApp } from 'antd';
import './App.css';
import CreateEnvelopeForm from "./components/CreateEnvelopeForm/CreateEnvelopeForm.tsx";

function AppContent() {
  return (
    <div className="app-container">
      <h1>Budget OK</h1>
      <div className="card">
        <h2>Create New Envelope</h2>
        <CreateEnvelopeForm />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AntdApp>
      <AppContent />
    </AntdApp>
  );
}

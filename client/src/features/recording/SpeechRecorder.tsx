import { useState, useEffect, useRef } from 'react';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const SpeechRecorder = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [soapNote, setSoapNote] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'https://notamed-api.up.railway.app/api/v1';

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support speech recognition. Please use Chrome.');
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = (event: any) => {
      let final = '';
      let interim = '';
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      setTranscript(final || interim);
    };

    rec.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setError(`Speech error: ${event.error}`);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = rec;
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setError(null);
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleProcess = async () => {
    const trimmed = transcript.trim();
    if (!trimmed) {
      setError('Please speak something before processing.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    const payload = { transcript: trimmed, template: 'SOAP' };
    console.log('📤 Sending:', payload);

    try {
      const res = await fetch(`${API_URL}/formatting/note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || `Server error: ${res.status}`);
      }

      const data = await res.json();
      console.log('📥 Received:', data);
      setSoapNote(data.formatted_note);
    } catch (err) {
      console.error('Formatting failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Clinical Dictation</h1>

      {error && (
        <div style={{ color: 'red', padding: '10px', background: '#ffeeee', borderRadius: '4px', marginBottom: '10px' }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{
        minHeight: '100px',
        border: '2px solid #ccc',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '20px',
        background: '#f9f9f9',
        fontSize: '16px',
        lineHeight: '1.5'
      }}>
        {transcript || 'Tap the mic and start speaking...'}
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {!isListening ? (
          <button
            onClick={startListening}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            🎤 Start
          </button>
        ) : (
          <button
            onClick={stopListening}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            ⏹ Stop
          </button>
        )}

        {transcript && !isListening && (
          <button
            onClick={handleProcess}
            disabled={isProcessing}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              opacity: isProcessing ? 0.6 : 1
            }}
          >
            {isProcessing ? '⏳ Generating...' : '📝 Generate SOAP'}
          </button>
        )}
      </div>

      {soapNote && (
        <div style={{
          marginTop: '30px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          background: 'white'
        }}>
          <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>SOAP Note</h2>
          <div style={{ marginBottom: '15px' }}>
            <p><strong>Subjective:</strong> {soapNote.subjective || 'N/A'}</p>
            <p><strong>Objective:</strong> {soapNote.objective || 'N/A'}</p>
            <p><strong>Assessment:</strong> {soapNote.assessment || 'N/A'}</p>
            <p><strong>Plan:</strong> {soapNote.plan || 'N/A'}</p>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(JSON.stringify(soapNote, null, 2))}
            style={{
              padding: '8px 16px',
              background: '#607D8B',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            📋 Copy SOAP
          </button>
        </div>
      )}
    </div>
  );
};

export default SpeechRecorder;

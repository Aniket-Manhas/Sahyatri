import VoiceAssistant from '../../components/chatbot/VoiceAssistant';

export default function VoiceAssistantPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Voice Assistant</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <VoiceAssistant />

          <div className="mt-8 bg-bg-secondary p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">How to Use the Voice Assistant</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Tap the microphone button to start speaking</li>
              <li>Ask your question clearly when the assistant is listening</li>
              <li>Wait for the assistant to process and respond to your query</li>
              <li>The assistant will speak the response back to you</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-bg-secondary p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-semibold mb-4">Example Questions</h2>
          <ul className="space-y-3">
            <li className="p-2 bg-bg-primary rounded border border-border">
              How do I find my platform at Delhi station?
            </li>
            <li className="p-2 bg-bg-primary rounded border border-border">
              What facilities are available at Mumbai Central?
            </li>
            <li className="p-2 bg-bg-primary rounded border border-border">
              How can I navigate from the entrance to platform 3?
            </li>
            <li className="p-2 bg-bg-primary rounded border border-border">
              What are the dining options at Chennai Central?
            </li>
            <li className="p-2 bg-bg-primary rounded border border-border">
              How early should I arrive before my train?
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 
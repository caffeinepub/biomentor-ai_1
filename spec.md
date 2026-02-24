# Specification

## Summary
**Goal:** Add a Live Voice Chat mode to the existing AI Tutor page, enabling real-time spoken conversation between the student and the AI biology tutor using browser-native Web Speech APIs.

**Planned changes:**
- Add a "Text Chat" tab and a "Voice Chat" tab to the AI Tutor page, with seamless switching between them
- Implement a large microphone button to start/stop listening using the browser's SpeechRecognition API
- Display a status indicator cycling through "Listening…", "Thinking…", and "Speaking…" states
- Show a pulsing animation or visual audio waveform during listening and AI speaking states
- Pass recognized speech text to the existing `bioAI` client-side logic to generate biology responses
- Read AI responses aloud using the browser's speechSynthesis API
- Support interruption: if the student speaks while the AI is talking, synthesis stops and recognition restarts immediately
- Display a scrollable transcript panel showing each conversation turn (student speech and AI response)
- Add a "Stop" button to end the voice session and reset the UI to idle
- Show an unsupported-browser message if SpeechRecognition or speechSynthesis is not available
- Enforce the existing trial/subscription gate for voice chat access (show TrialExpiredModal if trial has expired)

**User-visible outcome:** Students can switch to a Voice Chat tab on the AI Tutor page and have a live, spoken back-and-forth conversation with the AI biology tutor, with real-time transcript, animated feedback, and support for interrupting the AI mid-response.

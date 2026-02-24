# Specification

## Summary
**Goal:** Fix the broken Live Voice Chat feature on the AI Tutor page so it works end-to-end using the Web Speech API.

**Planned changes:**
- Audit and fix `AITutor.tsx` so the Voice Chat tab renders correctly without runtime errors
- Audit and fix `VoiceChatInterface.tsx` to display the microphone button, waveform/pulsing animation, status indicator, and transcript panel
- Fix `useVoiceChat.ts` hook to correctly manage state transitions between "Listening", "Thinking", and "Speaking"
- Ensure the microphone button starts/stops `SpeechRecognition` and recognized speech is passed to `bioAI.ts`
- Ensure the AI response is read aloud via `speechSynthesis` and the transcript panel updates in real time
- Handle interruption: if the student speaks while AI is talking, stop `speechSynthesis` and restart recognition
- Add graceful degradation message for browsers that do not support the Web Speech API

**User-visible outcome:** Students can open the Voice Chat tab on the AI Tutor page, speak a question, see the status cycle through Listening → Thinking → Speaking, hear the AI response read aloud, and view the full conversation transcript in real time without any errors.

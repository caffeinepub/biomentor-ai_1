import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface StudentProfile {
    trialExpired: boolean;
    trialStarted: bigint;
    name: string;
    email: string;
    subscriptionActive: boolean;
}
export interface DocumentMetadata {
    name: string;
    extractedText: string;
    uploadDate: bigint;
}
export interface ConversationTurn {
    question: string;
    timestamp: bigint;
    aiResponse: string;
}
export interface ConversationHistory {
    turns: Array<ConversationTurn>;
    lastActivity: bigint;
    createdAt: bigint;
}
export interface PracticeRecord {
    topic: string;
    attempts: bigint;
    score: bigint;
    lastAttempt: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addConversationTurn(turn: ConversationTurn): Promise<void>;
    addExtractedDoc(doc: DocumentMetadata): Promise<void>;
    addPracticeRecord(record: PracticeRecord): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkTrialStatus(): Promise<boolean>;
    clearConversationHistory(): Promise<void>;
    getCallerUserProfile(): Promise<StudentProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getConversationHistory(): Promise<ConversationHistory | null>;
    getPracticeRecords(): Promise<Array<PracticeRecord>>;
    getStudyMaterials(): Promise<Array<DocumentMetadata>>;
    getUserProfile(user: Principal): Promise<StudentProfile | null>;
    getWeakTopics(): Promise<Array<PracticeRecord>>;
    isCallerAdmin(): Promise<boolean>;
    removeStudyMaterial(docName: string): Promise<void>;
    saveCallerUserProfile(profile: StudentProfile): Promise<void>;
    startFreeTrial(): Promise<void>;
}

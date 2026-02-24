import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  StudentProfile,
  ConversationTurn,
  DocumentMetadata,
  PracticeRecord,
} from '../backend';

// ─── Profile ────────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<StudentProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: StudentProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['trialStatus'] });
    },
  });
}

// ─── Trial ───────────────────────────────────────────────────────────────────

export function useCheckTrialStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['trialStatus'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.checkTrialStatus();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 60_000,
  });
}

export function useStartFreeTrial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.startFreeTrial();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trialStatus'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Conversation ─────────────────────────────────────────────────────────────

export function useGetConversationHistory() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['conversationHistory'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getConversationHistory();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddConversationTurn() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (turn: ConversationTurn) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addConversationTurn(turn);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversationHistory'] });
    },
  });
}

export function useClearConversationHistory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.clearConversationHistory();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversationHistory'] });
    },
  });
}

// ─── Study Materials ──────────────────────────────────────────────────────────

export function useGetStudyMaterials() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DocumentMetadata[]>({
    queryKey: ['studyMaterials'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStudyMaterials();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddExtractedDoc() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (doc: DocumentMetadata) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addExtractedDoc(doc);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyMaterials'] });
    },
  });
}

export function useRemoveStudyMaterial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (docName: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.removeStudyMaterial(docName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyMaterials'] });
    },
  });
}

// ─── Practice Records ─────────────────────────────────────────────────────────

export function useGetPracticeRecords() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PracticeRecord[]>({
    queryKey: ['practiceRecords'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPracticeRecords();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddPracticeRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: PracticeRecord) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addPracticeRecord(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['practiceRecords'] });
      queryClient.invalidateQueries({ queryKey: ['weakTopics'] });
    },
  });
}

export function useGetWeakTopics() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PracticeRecord[]>({
    queryKey: ['weakTopics'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWeakTopics();
    },
    enabled: !!actor && !actorFetching,
  });
}

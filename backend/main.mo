import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Blob "mo:core/Blob";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import List "mo:core/List";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type StudentProfile = {
    name : Text;
    email : Text;
    trialStarted : Int;
    trialExpired : Bool;
    subscriptionActive : Bool;
  };

  public type QuestionType = {
    #twoMark;
    #fiveMark;
    #eightMark;
    #tenMark;
    #mcq;
    #assertionReason;
    #caseBased;
  };

  public type PracticeRecord = {
    topic : Text;
    score : Nat;
    attempts : Nat;
    lastAttempt : Int;
  };

  public type DocumentMetadata = {
    name : Text;
    uploadDate : Int;
    extractedText : Text;
  };

  public type ConversationTurn = {
    question : Text;
    aiResponse : Text;
    timestamp : Int;
  };

  public type ConversationHistory = {
    turns : [ConversationTurn];
    createdAt : Int;
    lastActivity : Int;
  };

  module PracticeRecord {
    public func compare(a : PracticeRecord, b : PracticeRecord) : Order.Order {
      Text.compare(a.topic, b.topic);
    };

    public func compareByScore(a : PracticeRecord, b : PracticeRecord) : Order.Order {
      Int.compare(a.score, b.score);
    };

    public func compareByAttempts(a : PracticeRecord, b : PracticeRecord) : Order.Order {
      Int.compare(a.attempts, b.attempts);
    };
  };

  let studentProfiles = Map.empty<Principal, StudentProfile>();
  let conversationHistories = Map.empty<Principal, ConversationHistory>();
  let extractedDocs = Map.empty<Principal, List.List<DocumentMetadata>>();
  let practiceRecords = Map.empty<Principal, List.List<PracticeRecord>>();

  // --- Profile management (required by instructions) ---

  public query ({ caller }) func getCallerUserProfile() : async ?StudentProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their profile");
    };
    studentProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?StudentProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    studentProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : StudentProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    studentProfiles.add(caller, profile);
  };

  // --- Trial management ---

  public shared ({ caller }) func startFreeTrial() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access trial");
    };

    let now = Time.now();
    let existing = switch (studentProfiles.get(caller)) {
      case (null) {
        Runtime.trap("Invalid user profile - please try again.");
      };
      case (?profile) {
        if (profile.trialStarted > 0) {
          Runtime.trap("Your free trial has already begun.");
        };
        {
          profile with
          trialStarted = now;
        };
      };
    };
    studentProfiles.add(caller, existing);
  };

  public query ({ caller }) func checkTrialStatus() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check trial status");
    };
    switch (studentProfiles.get(caller)) {
      case (?profile) {
        if (profile.subscriptionActive) { return true };
        if (profile.trialExpired) { return false };
        if (profile.trialStarted == 0) {
          return true;
        };

        let now = Time.now();
        let duration = now - profile.trialStarted;
        let dayNanos = 24 * 3600 * 1000000000;
        duration < dayNanos;
      };
      case (null) { false };
    };
  };

  // --- Study materials ---

  public query ({ caller }) func getStudyMaterials() : async [DocumentMetadata] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view study materials");
    };
    switch (extractedDocs.get(caller)) {
      case (?docs) { docs.toArray() };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func addExtractedDoc(doc : DocumentMetadata) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Can only add your own study materials");
    };

    let updatedDocs = switch (extractedDocs.get(caller)) {
      case (?docs) {
        docs.add(doc);
        docs;
      };
      case (null) {
        let docs = List.empty<DocumentMetadata>();
        docs.add(doc);
        docs;
      };
    };
    extractedDocs.add(caller, updatedDocs);
  };

  public shared ({ caller }) func removeStudyMaterial(docName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Can only delete your own docs");
    };

    switch (extractedDocs.get(caller)) {
      case (?docs) {
        let filteredDocs = docs.filter(func(d) { d.name != docName });
        extractedDocs.add(caller, filteredDocs);
      };
      case (null) { Runtime.trap("Doc not found") };
    };
  };

  // --- Practice records ---

  public query ({ caller }) func getPracticeRecords() : async [PracticeRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view practice records");
    };
    switch (practiceRecords.get(caller)) {
      case (?records) { records.toArray().sort() };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func addPracticeRecord(record : PracticeRecord) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save practice records");
    };

    let records = switch (practiceRecords.get(caller)) {
      case (?existing) { existing };
      case (null) { List.empty<PracticeRecord>() };
    };

    records.add(record);
    practiceRecords.add(caller, records);
  };

  // --- Conversation history ---

  public query ({ caller }) func getConversationHistory() : async ?ConversationHistory {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view conversation history");
    };
    conversationHistories.get(caller);
  };

  public shared ({ caller }) func addConversationTurn(turn : ConversationTurn) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Can only add your own questions");
    };

    let updatedHistory = switch (conversationHistories.get(caller)) {
      case (?existing) {
        {
          existing with
          turns = existing.turns.concat([turn]);
          lastActivity = turn.timestamp;
        };
      };
      case (null) {
        {
          turns = [turn];
          createdAt = turn.timestamp;
          lastActivity = turn.timestamp;
        };
      };
    };
    conversationHistories.add(caller, updatedHistory);
  };

  public shared ({ caller }) func clearConversationHistory() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Can only clear your own history");
    };
    ignore conversationHistories.remove(caller);
  };

  // --- Adaptive learning ---

  public query ({ caller }) func getWeakTopics() : async [PracticeRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view weak topics");
    };
    switch (practiceRecords.get(caller)) {
      case (?records) {
        records.filter(
          func(r) { r.score < 60 and r.attempts >= 5 },
        ).toArray().sort(PracticeRecord.compareByScore);
      };
      case (null) { [] };
    };
  };
};

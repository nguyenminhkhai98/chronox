import Map "mo:motoko-hash-map/Map";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Debug "mo:base/Debug";

actor ChronoManager {

  type EventPayload = {
    title : Text;
    location : Text;
    startTime : Time.Time;
    completed : Bool;
  };

  type Event = EventPayload and {
    id : Nat;
    creator : Principal;
    attendees : [Principal];
  };

  type EventSummary = EventPayload and {
    numOfAttendees : Nat;
    id : Nat;
    creator : Principal;
  };

  let { nhash } = Map;
  stable let chronoEvents : Map.Map<Nat, Event> = Map.new();
  stable var nextEventId : Nat = 1;

  public query func getEvents() : async [EventSummary] {
    return Array.map<Event, EventSummary>(Iter.toArray(Map.vals(chronoEvents)), func event = ({ event with numOfAttendees = Array.size(event.attendees); creator = event.creator }));
  };

  public shared ({ caller }) func createEvent(payload : EventPayload) : async Nat {
    if (Principal.isAnonymous(caller)) {
      Debug.trap("Anonymous caller");
    };
    let newEvent : Event = {
      payload with id = nextEventId;
      creator = caller;
      attendees = [];
    };
    Map.set(chronoEvents, nhash, nextEventId, newEvent);
    nextEventId += 1;
    return nextEventId - 1;
  };

  public query func getEventDetail(eventId : Nat) : async Event {
    switch (Map.get(chronoEvents, nhash, eventId)) {
      case (?e) { e };
      case null {
        Debug.trap("event not found");
      };
    };
  };

  public shared ({ caller }) func attendEvent(eventId : Nat) : async () {
    if (Principal.isAnonymous(caller)) {
      Debug.trap("Anonymous caller");
    };
    switch (Map.get(chronoEvents, nhash, eventId)) {
      case (?event) {
        if (event.completed) {
          Debug.trap("event completed");
        };
        if (Array.find<Principal>(event.attendees, func attendee = attendee == caller) != null) {
          Debug.trap("user already attend");
        };
        Map.set(chronoEvents, nhash, eventId, { event with attendees = Array.append(event.attendees, [caller]) });
      };
      case null {
        Debug.trap("event not found");
      };
    };
  };

  public shared ({ caller }) func completeEvent(eventId : Nat) : async () {
    if (Principal.isAnonymous(caller)) {
      Debug.trap("Anonymous caller");
    };
    switch (Map.get(chronoEvents, nhash, eventId)) {
      case (?event) { 
        if (event.creator != caller) {
          Debug.trap("Only event creator can complete event");
        };
        Map.set(chronoEvents, nhash, eventId, { event with completed = true });
      };
      case null {
        Debug.trap("event not found");
      };
    };
  };
};

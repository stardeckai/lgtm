export type SeatState = { seats: string[]; held: string[]; error: string | null };

export type SeatAction =
  | { type: "hold"; seat: string }
  | { type: "release"; seat: string }
  | { type: "clear" };

export function seatReducer(state: SeatState, action: SeatAction): SeatState {
  switch (action.type) {
    case "hold": {
      if (!state.seats.includes(action.seat)) return { ...state, error: "unknown seat" };
      if (state.held.includes(action.seat)) return { ...state, error: "already held" };
      if (state.held.length >= 4) return { ...state, error: "limit reached" };
      return { ...state, held: [...state.held, action.seat], error: null };
    }
    case "release":
      return { ...state, held: state.held.filter((s) => s !== action.seat), error: null };
    case "clear":
      return { ...state, held: [], error: null };
  }
}

export function holdSeats(
  dispatch: (action: SeatAction) => void,
  seats: string[],
): void {
  dispatch({ type: "clear" });
  for (const seat of seats) dispatch({ type: "hold", seat });
}

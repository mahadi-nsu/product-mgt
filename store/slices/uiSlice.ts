import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ModalState = { type: "confirm" | null; props?: Record<string, unknown> };

export type UiState = {
  modal: ModalState;
  isLoading: boolean;
  toast: { message: string; variant?: "success" | "error" | "info" } | null;
};

const initialState: UiState = {
  modal: { type: null },
  isLoading: false,
  toast: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showConfirm: (state, action: PayloadAction<ModalState["props"]>) => {
      state.modal = { type: "confirm", props: action.payload };
    },
    hideModal: (state) => {
      state.modal = { type: null };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    showToast: (state, action: PayloadAction<UiState["toast"]>) => {
      state.toast = action.payload;
    },
    clearToast: (state) => {
      state.toast = null;
    },
  },
});

export const { showConfirm, hideModal, setLoading, showToast, clearToast } =
  uiSlice.actions;
export default uiSlice.reducer;

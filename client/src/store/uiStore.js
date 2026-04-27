import { create } from 'zustand';

/**
 * uiStore — client-only UI state (tooltips, modals, selections).
 * Never sent to the server.
 */
export const useUiStore = create((set) => ({
  // Card tooltip
  tooltipCard: null,      // CardDefinition | null
  tooltipPos: null,       // { x, y } | null

  // Currently selected card instance (for targeting)
  selectedInstanceId: null,

  // Open modal name
  openModal: null,        // null | 'cardBrowser' | 'dilemmaChoice' | 'gameOver'
  modalProps: {},

  setTooltip: (card, pos) => set({ tooltipCard: card, tooltipPos: pos }),
  clearTooltip: () => set({ tooltipCard: null, tooltipPos: null }),

  selectCard: (instanceId) => set({ selectedInstanceId: instanceId }),
  clearSelection: () => set({ selectedInstanceId: null }),

  openModal: (name, props = {}) => set({ openModal: name, modalProps: props }),
  closeModal: () => set({ openModal: null, modalProps: {} }),
}));

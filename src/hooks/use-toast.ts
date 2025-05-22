
"use client"
/**
 * @fileOverview Custom hook `useToast` for managing and displaying toast notifications.
 * Inspired by the react-hot-toast library, this hook provides a simple API
 * to show, update, and dismiss toasts within the application.
 * It uses a reducer pattern to manage the state of active toasts.
 */

// Inspired by react-hot-toast library
import React, { useState, useEffect } from "react";

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast" // Assuming these types are correctly defined in your toast UI component

/** Maximum number of toasts to display at once. */
const TOAST_LIMIT = 1;
/** Delay in milliseconds before a dismissed toast is removed from the DOM. */
const TOAST_REMOVE_DELAY = 1000000; // A very long delay, effectively meaning toasts are removed when explicitly dismissed or replaced.

/**
 * Extended toast type used internally by the toaster, including an `id`.
 */
type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

/**
 * Action types for the toast reducer.
 */
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0; // Counter for generating unique toast IDs.

/**
 * Generates a unique ID for a new toast.
 * @returns {string} A unique string ID.
 */
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

/**
 * Defines the possible actions for the toast reducer.
 */
type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>; // For updating existing toasts
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"]; // Optional: dismiss all if no ID
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"]; // Optional: remove all if no ID
    };

/**
 * Defines the state shape for the toast system.
 */
interface State {
  toasts: ToasterToast[];
}

// Map to store timeouts for removing dismissed toasts from the DOM.
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Adds a toast ID to a queue for removal after a delay.
 * This prevents toasts from being immediately removed from the DOM upon dismissal,
 * allowing for exit animations.
 * @param {string} toastId - The ID of the toast to queue for removal.
 */
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return; // Already queued
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

/**
 * Reducer function for managing toast state.
 * @param {State} state - The current toast state.
 * @param {Action} action - The action to perform.
 * @returns {State} The new toast state.
 */
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        // Add new toast to the beginning and limit the total number of toasts
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        // Update the specified toast by its ID
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // Side effect: Add toast(s) to remove queue for delayed DOM removal
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        // If no toastId, dismiss all visible toasts
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        // Set 'open' to false for the specified toast(s) to trigger exit animations
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case "REMOVE_TOAST":
      // Remove toast(s) from the state (and thus the DOM)
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [], // Remove all toasts
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId), // Remove specific toast
      };
  }
};

// Array of listener functions to be called when toast state changes.
const listeners: Array<(state: State) => void> = [];

// In-memory state for toasts.
let memoryState: State = { toasts: [] };

/**
 * Dispatches an action to the toast reducer and notifies listeners.
 * @param {Action} action - The action to dispatch.
 */
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

/**
 * Defines the properties for a new toast, excluding the `id`.
 */
type Toast = Omit<ToasterToast, "id">;

/**
 * Function to create and display a new toast.
 * @param {Toast} props - Properties for the new toast.
 * @returns {{ id: string; dismiss: () => void; update: (props: ToasterToast) => void }}
 *          An object containing the toast's ID and functions to dismiss or update it.
 */
function toast({ ...props }: Toast) {
  const id = genId(); // Generate a unique ID for the toast

  /**
   * Updates an existing toast.
   * @param {ToasterToast} updateProps - The properties to update on the toast.
   */
  const update = (updateProps: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...updateProps, id },
    });

  /**
   * Dismisses the current toast.
   */
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  // Dispatch action to add the new toast
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true, // Toasts are initially open
      onOpenChange: (open) => { // Handle dismissal via UI component (e.g., close button)
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

/**
 * Custom React hook `useToast`.
 * Provides access to the current toast state and functions to create/dismiss toasts.
 * @returns {{ toasts: ToasterToast[]; toast: (props: Toast) => { id: string; dismiss: () => void; update: (props: ToasterToast) => void; }; dismiss: (toastId?: string) => void; }}
 *          An object containing the list of active toasts, and `toast` and `dismiss` functions.
 */
function useToast() {
  const [state, setState] = useState<State>(memoryState); // Local state synced with global memoryState

  // Subscribe to changes in the global toast state.
  useEffect(() => {
    listeners.push(setState);
    return () => {
      // Unsubscribe when the component unmounts
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]); // Re-subscribe if local state instance changes (shouldn't happen often)

  return {
    ...state, // Current toasts array
    toast,    // Function to create a new toast
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }), // Function to dismiss toasts
  };
}

export { useToast, toast };

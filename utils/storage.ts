import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChallengeState } from '@/types';
import { STORAGE_KEYS } from '@/constants/challenge';

// Save challenge state to AsyncStorage
export async function saveChallengeState(state: ChallengeState): Promise<void> {
  try {
    const jsonValue = JSON.stringify(state);
    await AsyncStorage.setItem(STORAGE_KEYS.CHALLENGE_STATE, jsonValue);
  } catch (error) {
    console.error('Error saving challenge state:', error);
    throw error;
  }
}

// Load challenge state from AsyncStorage
export async function loadChallengeState(): Promise<ChallengeState | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.CHALLENGE_STATE);
    if (jsonValue === null) {
      return null;
    }
    return JSON.parse(jsonValue) as ChallengeState;
  } catch (error) {
    console.error('Error loading challenge state:', error);
    return null;
  }
}

// Clear all challenge data
export async function clearChallengeState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.CHALLENGE_STATE);
  } catch (error) {
    console.error('Error clearing challenge state:', error);
    throw error;
  }
}

// Check if challenge data exists
export async function hasChallengeState(): Promise<boolean> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.CHALLENGE_STATE);
    return jsonValue !== null;
  } catch (error) {
    console.error('Error checking challenge state:', error);
    return false;
  }
}

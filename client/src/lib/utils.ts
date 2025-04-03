import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a breed name by replacing underscores with spaces and properly capitalizing each word
 * @param breedName The raw breed name (e.g. "flat-coated_retriever")
 * @returns Formatted breed name (e.g. "Flat-coated Retriever")
 */
export function formatBreedName(breedName: string): string {
  return breedName
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

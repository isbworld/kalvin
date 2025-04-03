import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const breedPredictions = pgTable("breed_predictions", {
  id: serial("id").primaryKey(),
  petName: text("pet_name"),
  imageUrl: text("image_url").notNull(),
  createdAt: text("created_at").notNull(),
});

export const breedMatches = pgTable("breed_matches", {
  id: serial("id").primaryKey(),
  predictionId: integer("prediction_id").notNull(),
  breedName: text("breed_name").notNull(),
  probability: integer("probability").notNull(),
});

export const dogAttributes = pgTable("dog_attributes", {
  id: serial("id").primaryKey(),
  predictionId: integer("prediction_id").notNull(),
  size: integer("size").notNull(),
  weight: integer("weight").notNull(),
  aggression: integer("aggression").notNull(),
  trainability: integer("trainability").notNull(),
  energyLevel: integer("energy_level").notNull(),
  lifespan: integer("lifespan").notNull(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  predictionId: integer("prediction_id").notNull(),
  pdfUrl: text("pdf_url").notNull(),
  createdAt: text("created_at").notNull(),
});

export const dnaTests = pgTable("dna_tests", {
  id: serial("id").primaryKey(),
  predictionId: integer("prediction_id").notNull(),
  kitType: text("kit_type").notNull(),  // "standard" or "premium"
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  status: text("status").notNull(), // "ordered", "shipped", "completed"
  orderedAt: text("ordered_at").notNull(),
  results: text("results"), // JSON string with test results
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBreedPredictionSchema = createInsertSchema(breedPredictions).pick({
  petName: true,
  imageUrl: true,
  createdAt: true,
});

export const insertBreedMatchSchema = createInsertSchema(breedMatches).pick({
  predictionId: true,
  breedName: true,
  probability: true,
});

export const insertDogAttributesSchema = createInsertSchema(dogAttributes).pick({
  predictionId: true,
  size: true,
  weight: true,
  aggression: true,
  trainability: true,
  energyLevel: true,
  lifespan: true,
});

export const insertReportSchema = createInsertSchema(reports).pick({
  predictionId: true,
  pdfUrl: true,
  createdAt: true,
});

export const insertDNATestSchema = createInsertSchema(dnaTests).pick({
  predictionId: true,
  kitType: true,
  fullName: true,
  email: true, 
  phoneNumber: true,
  address: true,
  city: true,
  state: true,
  postalCode: true,
  status: true,
  orderedAt: true,
  results: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertBreedPrediction = z.infer<typeof insertBreedPredictionSchema>;
export type InsertBreedMatch = z.infer<typeof insertBreedMatchSchema>;
export type InsertDogAttributes = z.infer<typeof insertDogAttributesSchema>;
export type InsertReport = z.infer<typeof insertReportSchema>;
export type InsertDNATest = z.infer<typeof insertDNATestSchema>;

export type User = typeof users.$inferSelect;
export type BreedPrediction = typeof breedPredictions.$inferSelect;
export type BreedMatch = typeof breedMatches.$inferSelect;
export type DogAttribute = typeof dogAttributes.$inferSelect;
export type Report = typeof reports.$inferSelect;
export type DNATest = typeof dnaTests.$inferSelect;

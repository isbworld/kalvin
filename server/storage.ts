import * as schema from "@shared/schema";
import {
  users,
  breedPredictions,
  breedMatches,
  dogAttributes,
  reports,
  dnaTests,
  type User,
  type InsertUser,
  type BreedPrediction,
  type InsertBreedPrediction,
  type BreedMatch,
  type InsertBreedMatch,
  type DogAttribute,
  type InsertDogAttributes,
  type Report,
  type InsertReport,
  type DNATest,
  type InsertDNATest
} from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import config from './config';

// Required for edge environments
neonConfig.webSocketConstructor = ws;
import { eq } from "drizzle-orm";

// Modify the interface with any CRUD methods needed
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Breed Predictions
  createBreedPrediction(prediction: InsertBreedPrediction): Promise<BreedPrediction>;
  getBreedPrediction(id: number): Promise<BreedPrediction | undefined>;
  getAllBreedPredictions(): Promise<BreedPrediction[]>;

  // Breed Matches
  createBreedMatch(match: InsertBreedMatch): Promise<BreedMatch>;
  getBreedMatchesByPredictionId(predictionId: number): Promise<BreedMatch[]>;

  // Dog Attributes
  createDogAttributes(attributes: InsertDogAttributes): Promise<DogAttribute>;
  getDogAttributesByPredictionId(predictionId: number): Promise<DogAttribute | undefined>;

  // Reports
  createReport(report: InsertReport): Promise<Report>;
  getReportsByPredictionId(predictionId: number): Promise<Report[]>;

  // DNA Tests
  createDNATest(test: InsertDNATest): Promise<DNATest>;
  getDNATestsByPredictionId(predictionId: number): Promise<DNATest[]>;
  getAllDNATests(): Promise<DNATest[]>;
  updateDNATestStatus(id: number, status: string): Promise<DNATest | undefined>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private breedPredictions: Map<number, BreedPrediction>;
  private breedMatches: Map<number, BreedMatch>;
  private dogAttributes: Map<number, DogAttribute>;
  private reports: Map<number, Report>;
  private dnaTests: Map<number, DNATest>;
  
  private userId: number;
  private predictionId: number;
  private matchId: number;
  private attributeId: number;
  private reportId: number;
  private testId: number;

  constructor() {
    this.users = new Map();
    this.breedPredictions = new Map();
    this.breedMatches = new Map();
    this.dogAttributes = new Map();
    this.reports = new Map();
    this.dnaTests = new Map();
    
    this.userId = 1;
    this.predictionId = 1;
    this.matchId = 1;
    this.attributeId = 1;
    this.reportId = 1;
    this.testId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Breed Prediction methods
  async createBreedPrediction(prediction: InsertBreedPrediction): Promise<BreedPrediction> {
    const id = this.predictionId++;
    const breedPrediction: BreedPrediction = { 
      ...prediction, 
      id,
      petName: prediction.petName || null 
    };
    this.breedPredictions.set(id, breedPrediction);
    return breedPrediction;
  }

  async getBreedPrediction(id: number): Promise<BreedPrediction | undefined> {
    return this.breedPredictions.get(id);
  }

  async getAllBreedPredictions(): Promise<BreedPrediction[]> {
    return Array.from(this.breedPredictions.values());
  }

  // Breed Match methods
  async createBreedMatch(match: InsertBreedMatch): Promise<BreedMatch> {
    const id = this.matchId++;
    const breedMatch: BreedMatch = { ...match, id };
    this.breedMatches.set(id, breedMatch);
    return breedMatch;
  }

  async getBreedMatchesByPredictionId(predictionId: number): Promise<BreedMatch[]> {
    return Array.from(this.breedMatches.values()).filter(
      (match) => match.predictionId === predictionId
    );
  }

  // Dog Attributes methods
  async createDogAttributes(attributes: InsertDogAttributes): Promise<DogAttribute> {
    const id = this.attributeId++;
    const dogAttribute: DogAttribute = { ...attributes, id };
    this.dogAttributes.set(id, dogAttribute);
    return dogAttribute;
  }

  async getDogAttributesByPredictionId(predictionId: number): Promise<DogAttribute | undefined> {
    return Array.from(this.dogAttributes.values()).find(
      (attr) => attr.predictionId === predictionId
    );
  }

  // Report methods
  async createReport(report: InsertReport): Promise<Report> {
    const id = this.reportId++;
    const newReport: Report = { ...report, id };
    this.reports.set(id, newReport);
    return newReport;
  }

  async getReportsByPredictionId(predictionId: number): Promise<Report[]> {
    return Array.from(this.reports.values()).filter(
      (report) => report.predictionId === predictionId
    );
  }

  // DNA Test methods
  async createDNATest(test: InsertDNATest): Promise<DNATest> {
    const id = this.testId++;
    const dnaTest: DNATest = { 
      ...test, 
      id,
      address: test.address || '',
      city: test.city || '',
      state: test.state || '',
      results: test.results || null 
    };
    this.dnaTests.set(id, dnaTest);
    return dnaTest;
  }

  async getDNATestsByPredictionId(predictionId: number): Promise<DNATest[]> {
    return Array.from(this.dnaTests.values()).filter(
      (test) => test.predictionId === predictionId
    );
  }

  async getAllDNATests(): Promise<DNATest[]> {
    return Array.from(this.dnaTests.values());
  }

  async updateDNATestStatus(id: number, status: string): Promise<DNATest | undefined> {
    const test = this.dnaTests.get(id);
    if (!test) return undefined;
    
    const updatedTest = { ...test, status };
    this.dnaTests.set(id, updatedTest);
    return updatedTest;
  }
}

// PostgreSQL storage implementation
export class PostgresStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    const sql = neon(config.database.url!);
    this.db = drizzle({ client: sql, schema: schema });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(user).returning();
    return result[0];
  }

  // Breed Prediction methods
  async createBreedPrediction(prediction: InsertBreedPrediction): Promise<BreedPrediction> {
    const result = await this.db.insert(breedPredictions).values(prediction).returning();
    return result[0];
  }

  async getBreedPrediction(id: number): Promise<BreedPrediction | undefined> {
    const result = await this.db.select().from(breedPredictions).where(eq(breedPredictions.id, id)).limit(1);
    return result[0];
  }

  async getAllBreedPredictions(): Promise<BreedPrediction[]> {
    return await this.db.select().from(breedPredictions);
  }

  // Breed Match methods
  async createBreedMatch(match: InsertBreedMatch): Promise<BreedMatch> {
    const result = await this.db.insert(breedMatches).values(match).returning();
    return result[0];
  }

  async getBreedMatchesByPredictionId(predictionId: number): Promise<BreedMatch[]> {
    return await this.db.select().from(breedMatches).where(eq(breedMatches.predictionId, predictionId));
  }

  // Dog Attributes methods
  async createDogAttributes(attributes: InsertDogAttributes): Promise<DogAttribute> {
    const result = await this.db.insert(dogAttributes).values(attributes).returning();
    return result[0];
  }

  async getDogAttributesByPredictionId(predictionId: number): Promise<DogAttribute | undefined> {
    const result = await this.db.select().from(dogAttributes).where(eq(dogAttributes.predictionId, predictionId)).limit(1);
    return result[0];
  }

  // Report methods
  async createReport(report: InsertReport): Promise<Report> {
    const result = await this.db.insert(reports).values(report).returning();
    return result[0];
  }

  async getReportsByPredictionId(predictionId: number): Promise<Report[]> {
    return await this.db.select().from(reports).where(eq(reports.predictionId, predictionId));
  }

  // DNA Test methods
  async createDNATest(test: InsertDNATest): Promise<DNATest> {
    const result = await this.db.insert(dnaTests).values(test).returning();
    return result[0];
  }

  async getDNATestsByPredictionId(predictionId: number): Promise<DNATest[]> {
    return await this.db.select().from(dnaTests).where(eq(dnaTests.predictionId, predictionId));
  }

  async getAllDNATests(): Promise<DNATest[]> {
    return await this.db.select().from(dnaTests);
  }

  async updateDNATestStatus(id: number, status: string): Promise<DNATest | undefined> {
    const result = await this.db.update(dnaTests)
      .set({ status })
      .where(eq(dnaTests.id, id))
      .returning();
    return result[0];
  }
}

// Use PostgreSQL in production, MemStorage in development if needed
export const storage = config.server.isProduction || config.database.url
  ? new PostgresStorage()
  : new MemStorage();

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { config } from '@/config/index.ts';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

interface StorageResult {
  filePath: string;
  url?: string;
  publicId?: string;
}

export class StorageService {
  private static instance: StorageService;
  private reportsDir: string;

  private constructor() {
    this.reportsDir = path.join(process.cwd(), 'reports');
    this.ensureLocalDirectory();
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  private ensureLocalDirectory(): void {
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  /**
   * Store a Word document buffer
   */
  async storeDocument(buffer: Buffer, filename: string): Promise<StorageResult> {
    if (config.environment === 'production') {
      return this.storeInCloudinary(buffer, filename);
    } else {
      return this.storeLocally(buffer, filename);
    }
  }

  /**
   * Retrieve a document
   */
  async retrieveDocument(filePath: string, publicId?: string): Promise<Buffer> {
    if (config.environment === 'production' && publicId) {
      return this.retrieveFromCloudinary(publicId);
    } else {
      return this.retrieveLocally(filePath);
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(filePath: string, publicId?: string): Promise<void> {
    if (config.environment === 'production' && publicId) {
      await this.deleteFromCloudinary(publicId);
    } else {
      await this.deleteLocally(filePath);
    }
  }

  /**
   * Store document locally (development)
   */
  private async storeLocally(buffer: Buffer, filename: string): Promise<StorageResult> {
    const filePath = path.join(this.reportsDir, filename);
    
    try {
      fs.writeFileSync(filePath, buffer);
      console.log(`Document stored locally: ${filePath}`);
      
      return {
        filePath,
      };
    } catch (error) {
      console.error('Error storing document locally:', error);
      throw new Error('Failed to store document locally');
    }
  }

  /**
   * Store document in Cloudinary (production)
   */
  private async storeInCloudinary(buffer: Buffer, filename: string): Promise<StorageResult> {
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        resource_type: 'raw' as const,
        folder: config.cloudinary.reportsFolder,
        public_id: filename.replace(/\.[^/.]+$/, ''), // Remove extension
        format: 'docx',
      };

      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new Error('Failed to upload to Cloudinary'));
            return;
          }

          if (!result) {
            reject(new Error('No result from Cloudinary upload'));
            return;
          }

          console.log(`Document stored in Cloudinary: ${result.secure_url}`);
          
          resolve({
            filePath: result.secure_url,
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      ).end(buffer);
    });
  }

  /**
   * Retrieve document locally
   */
  private async retrieveLocally(filePath: string): Promise<Buffer> {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }
      
      return fs.readFileSync(filePath);
    } catch (error) {
      console.error('Error retrieving document locally:', error);
      throw new Error('Failed to retrieve document from local storage');
    }
  }

  /**
   * Retrieve document from Cloudinary
   */
  private async retrieveFromCloudinary(publicId: string): Promise<Buffer> {
    try {
      const result = await cloudinary.api.resource(publicId, {
        resource_type: 'raw',
      });

      // Download the file from Cloudinary URL
      const response = await fetch(result.secure_url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      console.error('Error retrieving document from Cloudinary:', error);
      throw new Error('Failed to retrieve document from Cloudinary');
    }
  }

  /**
   * Delete document locally
   */
  private async deleteLocally(filePath: string): Promise<void> {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Document deleted locally: ${filePath}`);
      }
    } catch (error) {
      console.error('Error deleting document locally:', error);
      // Don't throw error for deletion failures
    }
  }

  /**
   * Delete document from Cloudinary
   */
  private async deleteFromCloudinary(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: 'raw',
      });
      console.log(`Document deleted from Cloudinary: ${publicId}`);
    } catch (error) {
      console.error('Error deleting document from Cloudinary:', error);
      // Don't throw error for deletion failures
    }
  }
}

export const storageService = StorageService.getInstance();
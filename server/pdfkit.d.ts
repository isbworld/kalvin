declare module 'pdfkit' {
  import { Readable } from 'stream';
  
  interface PDFDocumentOptions {
    size?: string | [number, number];
    margins?: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
    [key: string]: any;
  }
  
  interface TextOptions {
    align?: 'left' | 'center' | 'right' | 'justify';
    width?: number;
    height?: number;
    continued?: boolean;
    indent?: number;
    paragraphGap?: number;
    lineGap?: number;
    link?: string;
    underline?: boolean;
    strike?: boolean;
    oblique?: boolean;
    fill?: boolean;
    stroke?: boolean;
    [key: string]: any;
  }
  
  interface ImageOptions {
    width?: number;
    height?: number;
    scale?: number;
    fit?: [number, number];
    align?: 'left' | 'center' | 'right';
    valign?: 'top' | 'center' | 'bottom';
    link?: string;
    goTo?: string;
    [key: string]: any;
  }
  
  class PDFDocument extends Readable {
    constructor(options?: PDFDocumentOptions);
    
    pipe(destination: NodeJS.WritableStream): NodeJS.WritableStream;
    end(): void;
    
    save(): PDFDocument;
    restore(): PDFDocument;
    
    fontSize(size: number): PDFDocument;
    font(font: string, size?: number): PDFDocument;
    
    text(text: string, options?: TextOptions): PDFDocument;
    text(text: string, x: number, y: number, options?: TextOptions): PDFDocument;
    
    moveDown(lines?: number): PDFDocument;
    
    fillColor(color: string): PDFDocument;
    strokeColor(color: string): PDFDocument;
    
    image(
      src: string | Buffer,
      options?: ImageOptions
    ): PDFDocument;
    image(
      src: string | Buffer,
      x: number,
      y: number,
      options?: ImageOptions
    ): PDFDocument;
    
    addPage(options?: PDFDocumentOptions): PDFDocument;
    
    page: {
      width: number;
      height: number;
    };
    
    x: number;
    y: number;
  }
  
  export default PDFDocument;
}
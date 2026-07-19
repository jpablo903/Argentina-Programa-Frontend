import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UrlValidatorService {
  
  // Dominios permitidos para imágenes
  private readonly ALLOWED_IMAGE_DOMAINS = [
    'i.imgur.com',
    'imgur.com',
    'github.com',
    'raw.githubusercontent.com',
    'cloudinary.com',
    'images.unsplash.com',
    'cdn.pixabay.com',
    'images.pexels.com',
    'storage.googleapis.com',
    's3.amazonaws.com',
    'aws.amazon.com',
    'localhost'
  ];

  // Protocolos permitidos
  private readonly ALLOWED_PROTOCOLS = ['https:', 'http:', 'data:'];

  /**
   * Valida que una URL de imagen sea segura
   */
  isValidImageUrl(url: string): boolean {
    if (!url || url.trim() === '') {
      return false;
    }

    try {
      const urlObj = new URL(url);
      
      // Verificar protocolo
      if (!this.ALLOWED_PROTOCOLS.includes(urlObj.protocol)) {
        return false;
      }

      // Para data URLs, verificar que sea una imagen válida
      if (urlObj.protocol === 'data:') {
        return this.isValidDataUrl(url);
      }

      // Verificar dominio
      const domain = urlObj.hostname;
      const isAllowedDomain = this.ALLOWED_IMAGE_DOMAINS.some(allowed => 
        domain === allowed || domain.endsWith('.' + allowed)
      );

      return isAllowedDomain;
    } catch {
      return false;
    }
  }

  /**
   * Valida que una data URL sea una imagen válida
   */
  private isValidDataUrl(url: string): boolean {
    const dataUrlPattern = /^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml);base64,/i;
    return dataUrlPattern.test(url);
  }

  /**
   * Validador para Angular Forms
   */
  imageUrlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const url = control.value;
      
      if (!url || url.trim() === '') {
        return null; // Dejar que required maneje campos vacíos
      }

      if (!this.isValidImageUrl(url)) {
        return { invalidImageUrl: true };
      }

      return null;
    };
  }

  /**
   * Sanitiza una URL para prevenir inyección
   */
  sanitizeUrl(url: string): string {
    if (!url) return '';
    
    try {
      const urlObj = new URL(url);
      
      // Solo permitir protocolos seguros
      if (!this.ALLOWED_PROTOCOLS.includes(urlObj.protocol)) {
        return '';
      }

      return urlObj.toString();
    } catch {
      return '';
    }
  }
}

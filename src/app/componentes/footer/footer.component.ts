import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  socialLinks = [
    { icon: 'facebook', url: 'https://web.facebook.com/juanpa.r.904/', label: 'Facebook' },
    { icon: 'twitter', url: 'https://twitter.com/JuanPab57989868', label: 'Twitter' },
    { icon: 'github', url: 'https://github.com/jpablo903', label: 'GitHub' },
    { icon: 'linkedin', url: 'https://www.linkedin.com/in/juan-pablo-rajoy-93406a11b/', label: 'LinkedIn' }
  ];

  navLinks = [
    { label: 'Inicio', target: 'persona' },
    { label: 'Educación', target: 'estudios' },
    { label: 'Experiencia', target: 'experiencia' },
    { label: 'Skills', target: 'skills' },
    { label: 'Proyectos', target: 'proyectos' }
  ];

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.registerIcons();
  }

  private registerIcons(): void {
    const icons = [
      { name: 'facebook', file: 'facebook-brands.svg' },
      { name: 'twitter', file: 'twitter-brands.svg' },
      { name: 'github', file: 'git-alt-brands.svg' },
      { name: 'linkedin', file: 'linkedin-brands.svg' }
    ];
    icons.forEach(({ name, file }) => {
      this.iconRegistry.addSvgIcon(
        name,
        this.sanitizer.bypassSecurityTrustResourceUrl(`assets/${file}`)
      );
    });
  }

  scrollTo(target: string): void {
    const element = document.querySelector(`app-${target}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

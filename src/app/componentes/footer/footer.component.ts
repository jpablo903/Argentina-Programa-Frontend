import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

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

  scrollTo(target: string): void {
    const element = document.querySelector(`app-${target}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

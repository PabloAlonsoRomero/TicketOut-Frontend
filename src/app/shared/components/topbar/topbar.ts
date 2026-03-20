import { Component, inject, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { SearchService } from '../../../services/search.service';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-topbar',
  imports: [CommonModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar implements OnInit {
  private authService = inject(AuthService);
  private searchService = inject(SearchService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  userName: string = 'Usuario';
  userRole: string = 'USER';
  
  // LIVE SEARCH
  searchQuery = '';
  searchResults: { tickets: any[], users: any[] } | null = null;
  showResults = false;
  searching = false;
  private searchSubject = new Subject<string>();

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.name || user.email || 'Usuario';
      this.userRole = user.role || 'USER';
    }

    // Config de búsqueda reactiva (Optimizado: 150ms)
    this.searchSubject.pipe(
      debounceTime(150),
      distinctUntilChanged(),
      tap(() => {
        this.searching = true;
        this.cdr.detectChanges();
      }),
      switchMap(query => {
        if (!query.trim() || query.trim().length < 2) {
          return of({ success: true, data: { tickets: [], users: [] } });
        }
        return this.searchService.globalSearch(query);
      })
    ).subscribe(response => {
      this.searching = false;
      if (response && response.success) {
        this.searchResults = response.data;
        
        // Solo mostrar usuarios si es SUPERUSER
        if (this.userRole !== 'SUPERUSER') {
          this.searchResults!.users = [];
        }

        this.showResults = (this.searchResults!.tickets.length > 0 || this.searchResults!.users.length > 0);
      }
      // Forzar renderizado para respuesta inmediata
      this.cdr.detectChanges();
    });
  }

  onInputChange(event: any) {
    const query = event.target.value;
    this.searchQuery = query;
    this.searchSubject.next(query);
  }

  navigateToResult(type: 'ticket' | 'user', id: number) {
    this.showResults = false;
    this.searchQuery = '';
    console.log(`Navigating to ${type} with ID ${id}`);
    if (type === 'ticket') {
      this.router.navigate(['/tickets', id]);
    } else {
      this.router.navigate(['/users', id, 'edit']);
    }
  }

  onSearch(query: string) {
    this.showResults = false;
    if (query.trim()) {
      this.router.navigate(['/tickets'], { queryParams: { search: query } });
    } else {
      this.router.navigate(['/tickets'], { queryParams: {} });
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    const isInside = targetElement.closest('.position-relative'); // Detectar si el clic fue dentro de la caja de busqueda
    if (!isInside) {
      this.showResults = false;
      this.cdr.detectChanges();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

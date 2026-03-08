import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Topbar } from '../../shared/components/topbar/topbar';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterOutlet, Sidebar, Topbar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {

}

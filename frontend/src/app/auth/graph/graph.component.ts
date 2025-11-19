import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { PointsService, PointResponse } from '../point.service';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.css'] 
})
export class Graph implements OnInit, AfterViewInit {
  
  private authService = inject(AuthService);
  private pointsService = inject(PointsService);
  private router = inject(Router);


  @ViewChild('graphCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;


  xValues = [-3, -2, -1, 0, 1, 2, 3, 4, 5];
  rValues = [-3, -2, -1, 0, 1, 2, 3, 4, 5];

  
  selectedX: number | null = null;
  yValue: string = ''; 
  selectedR: number | null = null;

 
  points: PointResponse[] = [];
  currentUser: string = '';
  errorMessage: string = '';


  ngOnInit(): void {
    this.currentUser = this.authService.getUsername();
    this.loadPoints();
  }

  
  ngAfterViewInit(): void {
    this.drawGraph();
  }

  loadPoints() {
    this.pointsService.getPoints().subscribe({
      next: (data) => {
        this.points = data;
        this.drawGraph(); 
      },
      error: (err) => {
        if (err.status === 401) this.logout(); 
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  
  checkHit(x: number, y: number, r: number): boolean {
    if (!r || r <= 0) return false;

    
    if (x >= 0 && y >= 0) return (x * x + y * y) <= (r * r);

    
    if (x <= 0 && y >= 0) return y <= (x + r);

    if (x <= 0 && y <= 0) return false;

    if (x >= 0 && y <= 0) return x <= r && y >= -(r / 2);

    return false;
  }

  
  getDynamicStatus(p: PointResponse): boolean {
    
    if (this.selectedR && this.selectedR > 0) {
      return this.checkHit(p.x, p.y, this.selectedR);
    }
    
    return p.isHit;
  }

  

  onRChange(val: number) {
    this.selectedR = val;
    this.drawGraph(); 
  }

  
  validateForm(): boolean {
    this.errorMessage = '';
    
    if (this.selectedX === null) { 
      this.errorMessage = 'Выберите значение X'; return false; 
    }
    if (this.selectedR === null) { 
      this.errorMessage = 'Выберите значение R'; return false; 
    }
    if (this.selectedR <= 0) {
      this.errorMessage = 'Радиус R должен быть положительным'; return false;
    }

    
    let y = this.yValue.replace(',', '.');
    if (y.trim() === '' || isNaN(Number(y))) {
      this.errorMessage = 'Y должен быть числом'; return false;
    }
    const yNum = Number(y);
    if (yNum < -5 || yNum > 3) {
      this.errorMessage = 'Y должен быть в диапазоне (-5 ... 3)'; return false;
    }
    return true;
  }


  submitForm() {
    if (!this.validateForm()) return;

    const point = {
      x: this.selectedX!,
      y: parseFloat(this.yValue.replace(',', '.')),
      r: this.selectedR!
    };

    this.sendPoint(point);
  }

 
  clearPoints() {
    this.pointsService.deleteAllPoints().subscribe({
      next: () => {
        this.points = []; 
        this.drawGraph(); 
      },
      error: () => this.errorMessage = 'Ошибка при очистке истории'
    });
  }

  
  onCanvasClick(event: MouseEvent) {
    if (!this.selectedR || this.selectedR <= 0) {
      this.errorMessage = 'Для клика по графику выберите положительный R';
      return;
    }

    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    
    
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    
    const scale = 30; 

  
    let x = (clickX - centerX) / scale;
    let y = (centerY - clickY) / scale;

 
    x = parseFloat(x.toFixed(2));
    y = parseFloat(y.toFixed(2));

    this.sendPoint({ x, y, r: this.selectedR });
  }

  
  sendPoint(point: {x: number, y: number, r: number}) {
    this.pointsService.addPoint(point).subscribe({
      next: (res) => {
        this.points.push(res);
        this.drawGraph();
      },
      error: () => this.errorMessage = 'Ошибка сервера'
    });
  }

  
 drawGraph() {
    if (!this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;   
    const height = canvas.height; 
    const centerX = width / 2;
    const centerY = height / 2;
    
    
    const scale = 30; 

   
    ctx.clearRect(0, 0, width, height);

    
    const rVal = (this.selectedR && this.selectedR > 0) ? this.selectedR : 0;
    const R = rVal * scale;
    const R_half = R / 2;

    
    if (rVal > 0) {
      ctx.fillStyle = '#2196F3'; 

      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      
      ctx.arc(centerX, centerY, R, -Math.PI / 2, 0, false);
      ctx.fill();

     
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX, centerY - R); 
      ctx.lineTo(centerX - R, centerY); 
      ctx.fill();

      
      ctx.fillRect(centerX, centerY, R, R_half); 
    }

    
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2; 
    
    
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    
    ctx.lineWidth = 1;
    
    ctx.beginPath();
    ctx.moveTo(width - 10, centerY - 5);
    ctx.lineTo(width, centerY);
    ctx.lineTo(width - 10, centerY + 5);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(centerX - 5, 10);
    ctx.lineTo(centerX, 0);
    ctx.lineTo(centerX + 5, 10);
    ctx.stroke();

    
    ctx.fillStyle = 'black';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('x', width - 15, centerY - 10);
    ctx.fillText('y', centerX + 10, 15);

    
    if (rVal > 0) {
      const tickSize = 5; 
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

    
      ctx.beginPath();
      ctx.moveTo(centerX + R, centerY - tickSize);
      ctx.lineTo(centerX + R, centerY + tickSize);
      ctx.stroke();
      ctx.fillText(`${rVal}`, centerX + R, centerY + 15); 

      
      ctx.beginPath();
      ctx.moveTo(centerX + R_half, centerY - tickSize);
      ctx.lineTo(centerX + R_half, centerY + tickSize);
      ctx.stroke();
      ctx.fillText(`${rVal/2}`, centerX + R_half, centerY + 15);

      
      ctx.beginPath();
      ctx.moveTo(centerX - R, centerY - tickSize);
      ctx.lineTo(centerX - R, centerY + tickSize);
      ctx.stroke();
      ctx.fillText(`-${rVal}`, centerX - R, centerY + 15);

      
      ctx.beginPath();
      ctx.moveTo(centerX - R_half, centerY - tickSize);
      ctx.lineTo(centerX - R_half, centerY + tickSize);
      ctx.stroke();
      ctx.fillText(`-${rVal/2}`, centerX - R_half, centerY + 15);


      
      ctx.beginPath();
      ctx.moveTo(centerX - tickSize, centerY - R);
      ctx.lineTo(centerX + tickSize, centerY - R);
      ctx.stroke();
      ctx.textAlign = 'left'; 
      ctx.fillText(`${rVal}`, centerX + 10, centerY - R);

      
      ctx.beginPath();
      ctx.moveTo(centerX - tickSize, centerY - R_half);
      ctx.lineTo(centerX + tickSize, centerY - R_half);
      ctx.stroke();
      ctx.fillText(`${rVal/2}`, centerX + 10, centerY - R_half);

      
      ctx.beginPath();
      ctx.moveTo(centerX - tickSize, centerY + R);
      ctx.lineTo(centerX + tickSize, centerY + R);
      ctx.stroke();
      ctx.fillText(`-${rVal}`, centerX + 10, centerY + R);

      
      ctx.beginPath();
      ctx.moveTo(centerX - tickSize, centerY + R_half);
      ctx.lineTo(centerX + tickSize, centerY + R_half);
      ctx.stroke();
      ctx.fillText(`-${rVal/2}`, centerX + 10, centerY + R_half);
    }

    
    this.points.forEach(p => {
      const pX = centerX + p.x * scale;
      const pY = centerY - p.y * scale; 


      ctx.beginPath();
      ctx.arc(pX, pY, 4, 0, 2 * Math.PI);

     
      let isHitNow = p.isHit; 
      if (this.selectedR && this.selectedR > 0) {
        isHitNow = this.checkHit(p.x, p.y, this.selectedR);
      }

      
      ctx.fillStyle = isHitNow ? '#0f0' : '#f00'; 
      ctx.fill();
      
      
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }
}
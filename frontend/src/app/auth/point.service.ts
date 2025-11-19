import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface PointRequest {
  x: number;
  y: number;
  r: number;
}

export interface PointResponse {
  id: number;
  x: number;
  y: number;
  r: number;           
  isHit: boolean;      
  startTime: string;
  executionTime: number;
  creator: string;
}

@Injectable({
  providedIn: 'root'
})
export class PointsService {
  private http = inject(HttpClient);
  
  
  private apiUrl = 'http://localhost:3213/api/points'; 

  
  addPoint(point: PointRequest): Observable<PointResponse> {
    return this.http.post<PointResponse>(this.apiUrl, point);
  }

  
  getPoints(): Observable<PointResponse[]> {
    return this.http.get<PointResponse[]>(this.apiUrl);
  }

   deleteAllPoints(): Observable<void> {
    return this.http.delete<void>(this.apiUrl);
  }
}
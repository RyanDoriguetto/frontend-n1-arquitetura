import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = 'http://localhost:3000/itens';
  private http = inject(HttpClient);

  private itensSubject = new BehaviorSubject<any[]>([]);
  itens$ = this.itensSubject.asObservable();

  constructor() {
    this.carregarItens();
  }

  private carregarItens() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => this.itensSubject.next(data),
      error: (err) => console.error('Erro ao carregar itens', err)
    });
  }

  getItens(): Observable<any[]> {
    return this.itens$;
  }

  addItem(item: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, item).pipe(
      tap((novoItem) => {
        const itensAtualizados = [...this.itensSubject.value, novoItem];
        this.itensSubject.next(itensAtualizados);
      })
    );
  }

  updateItem(id: number, item: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, item).pipe(
      tap((itemAtualizado) => {
        const itensAtualizados = this.itensSubject.value.map(i =>
          i.id === id ? { ...i, nome: itemAtualizado.nome } : i
        );
        this.itensSubject.next(itensAtualizados);
      })
    );
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const itensAtualizados = this.itensSubject.value.filter(i => i.id !== id);
        this.itensSubject.next(itensAtualizados);
      })
    );
  }
}

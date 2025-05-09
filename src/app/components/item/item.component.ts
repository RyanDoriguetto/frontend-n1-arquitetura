import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  itens: any[] = [];
  novoItem = { nome: '' };
  itemEditandoId: number | null = null;
  novoNomeItem = '';

  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    this.carregarItens();
  }

  carregarItens() {
    this.itemService.getItens().subscribe({
      next: (data) => this.itens = data,
      error: (error) => console.error('Erro ao carregar itens:', error)
    });
  }

  adicionarItem() {
    if (!this.novoItem.nome.trim()) return;
    
    this.itemService.addItem(this.novoItem).subscribe({
      next: (itemCriado) => {
        this.novoItem = { nome: '' };
      },
      error: (error) => console.error('Erro ao adicionar item:', error)
    });
  }

  deletarItem(id: number) {
    this.itemService.deleteItem(id).subscribe({
      next: () => {},
      error: (error) => console.error('Erro ao deletar item:', error)
    });
  }

  editarItem(id: number, nome: string) {
    this.itemEditandoId = id;
    this.novoNomeItem = nome;
  }

  atualizarItem() {
    if (!this.itemEditandoId || !this.novoNomeItem.trim()) return;
    
    this.itemService.updateItem(this.itemEditandoId, { nome: this.novoNomeItem }).subscribe({
      next: () => {
        this.cancelarEdicao();
      },
      error: (error) => console.error('Erro ao atualizar item:', error)
    });
  }

  cancelarEdicao() {
    this.itemEditandoId = null;
    this.novoNomeItem = '';
  }
}

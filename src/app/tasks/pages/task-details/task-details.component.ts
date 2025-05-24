import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-task-details',
  template: `<p>Task details #{{ id }}</p>`,
})
export class TaskDetailsComponent {
  id = inject(ActivatedRoute).snapshot.paramMap.get('id');
}

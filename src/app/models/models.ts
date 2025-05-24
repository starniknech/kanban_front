export enum StatusEnum {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
  POSTPONED = 'POSTPONED',
}

export enum PriorityEnum {
  LOWEST = 'LOWEST',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  estimatedTime?: number;
  spentTime?: number;
  status: StatusEnum;
  priority: PriorityEnum;
  completedOn?: number;
  userId?: string;

  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  tasks: string[];

  createdAt: string;
  updatedAt: string;
}

export interface TourStep {
  id: string;
  targetSelector: string;
  title: string;
  description: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  actionLabel?: string;
  actionHref?: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  actionHref?: string;
  actionText?: string;
}

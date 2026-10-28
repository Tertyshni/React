import type { PriorityDto, StatusDto } from '../types/data';


export function StatusBadge({ statusId, statuses }: { statusId: string; statuses?: StatusDto[] }) {
  const name = statuses?.find((s) => s.id === statusId)?.name ?? '...';
  return <span className={`badge status-${statusId}`}>{name}</span>;
}

export function PriorityBadge({
  priorityId,
  priorities,
}: {
  priorityId: string;
  priorities?: PriorityDto[];
}) {
  const name = priorities?.find((p) => p.id === priorityId)?.name ?? '...';
  return <span className={`badge priority-${priorityId}`}>{name}</span>;
}

export type ProjectRecord = {
  project_id: string;
  project_name: string;
  owner_id: string;
  created_at: string;
};

export type ProjectDto = { id: string; name: string; ownerId: string; createdAt: string };

export function toProjectDto(record: ProjectRecord): ProjectDto {
  return {
    id: record.project_id,
    name: record.project_name,
    ownerId: record.owner_id,
    createdAt: record.created_at,
  };
}

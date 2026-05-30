export interface CheckpointData extends Record<string, unknown> {
  id: string;
  title: string;
  prompt: string | null;
  response: string | null;
  agent: string | null;
  session_id: string | null;
  parent_checkpoint_id: string | null;
  root_hash: string;
  file_count: number;
  created_at: string;
  private: boolean;
  is_head: boolean;
  is_main_chain: boolean;
  diff_added: number;
  diff_modified: number;
  diff_removed: number;
}

export interface GraphData {
  checkpoints: CheckpointData[];
  head_checkpoint_id: string | null;
  project_name: string;
}

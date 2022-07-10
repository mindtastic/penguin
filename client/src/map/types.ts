export interface Node {
  Name: string;
}

export type SpanAttributes = Record<string, string[] | undefined>;

export interface Edge {
  From: string;
  To: string;
  Attributes: SpanAttributes;
}

export interface Paths {
  Edges: Edge[];
  RequestRate: Number;
  Attributes: SpanAttributes;
}

export interface ServiceMap {
  Nodes: Node[];
  Edges: Edge[];
  Paths: Record<string, Paths>;
}

export const emptyServiceMap = {
  Nodes: [],
  Edges: [],
  Paths: {},
} as ServiceMap;

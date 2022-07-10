package main

type ServiceMap struct {
	Nodes []Node
	Edges []Edge
	Paths map[string]Path
}

func NewServiceMap() ServiceMap {
	return ServiceMap{
		Nodes: make([]Node, 0),
		Edges: make([]Edge, 0),
		Paths: make(map[string]Path, 0),
	}
}

type Node struct {
	Name string
}

func (s *ServiceMap) AddNode(name string) {
	for _, v := range s.Nodes {
		if v.Name == name {
			return
		}
	}
	s.Nodes = appendNodeUnique(s.Nodes, Node{Name: name})
}

type Edge struct {
	From       string
	To         string
	Attributes map[string][]string
}

func (s *ServiceMap) AddPathEdge(path, from, to string, attr map[string][]string) {
	if from == "" || to == "" || path == "" {
		return
	}
	for k, v := range s.Edges {
		if v.From == from && v.To == to {
			s.Edges[k].Attributes = mergeAttributes(v.Attributes, attr)

			return
		}
	}
	e := Edge{From: from, To: to, Attributes: attr}
	s.Edges = append(s.Edges, e)
	p, ok := s.Paths[path]
	if !ok {
		s.Paths[path] = Path{
			Edges: make([]Edge, 0),
		}
	}
	p.Edges = appendEdgeUnique(p.Edges, e)
	p.Attributes = mergeAttributes(p.Attributes, e.Attributes)
	s.Paths[path] = p
}

type Path struct {
	Edges       []Edge
	RequestRate int
	Attributes  map[string][]string
}

func (s *ServiceMap) Join(maps ...ServiceMap) {
	for _, m := range maps {
		s.Nodes = appendNodeUnique(s.Nodes, m.Nodes...)
		s.Edges = appendEdgeUnique(s.Edges, m.Edges...)
		for k, path := range m.Paths {
			v, ok := s.Paths[k]
			if !ok {
				s.Paths[k] = path
				continue
			}
			v.Attributes = mergeAttributes(path.Attributes)
			v.Edges = appendEdgeUnique(v.Edges, path.Edges...)
			s.Paths[k] = v
		}
	}
}

func mergeAttributes(arg ...map[string][]string) map[string][]string {
	ret := make(map[string][]string)

	for _, attrMap := range arg {
		for k, attr := range attrMap {
			v, ok := ret[k]
			if !ok {
				ret[k] = attr
			}
			ret[k] = appendStringUnique(v, attr...)
		}
	}
	return ret
}

func appendStringUnique(into []string, add ...string) []string {
	ret := into
	for _, a := range add {
		found := false
		for _, v := range into {
			if a == v {
				found = true
				break
			}
		}
		if !found {
			ret = append(ret, a)
		}
	}
	return ret
}

func appendNodeUnique(into []Node, add ...Node) []Node {
	ret := into
	for _, a := range add {
		found := false
		for _, v := range into {
			if a.Name == v.Name {
				found = true
				break
			}
		}
		if !found {
			ret = append(ret, a)
		}
	}
	return ret
}

func appendEdgeUnique(into []Edge, add ...Edge) []Edge {
	ret := into
	for i, a := range add {
		found := false
		for _, v := range into {
			if a.From == v.From && a.To == v.To {
				ret[i].Attributes = mergeAttributes(a.Attributes, v.Attributes)
				found = true
				break
			}
		}
		if !found {
			ret = append(ret, a)
		}
	}
	return ret
}

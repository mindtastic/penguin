package main

type ServiceMap struct {
	Nodes []Node
	Edges []Edge
	Paths []Path
}

type Node struct {
	Name string
}

type Edge struct {
	From       *Node
	To         *Node
	Attributes map[string][]string
}

type Path struct {
	Name        string
	Edges       []Edge
	RequestRate int
	Attributes  map[string][]string
}
